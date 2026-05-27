import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { PrintButton } from "@/components/admin/PrintButton";

export const dynamic = "force-dynamic";

type Item = {
  id: string;
  product_name: string;
  size: string | null;
  quantity: number;
  unit_price: number | string;
  line_total: number | string;
};

// Canonical talla order + fallback prices (used when a size wasn't ordered).
const SIZES = ["XS", "S", "M", "L", "XL"] as const;
const CANONICAL_PRICES: Record<string, number> = {
  XS: 20000,
  S: 21000,
  M: 21000,
  L: 23000,
  XL: 27000,
};

function formatCOP(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CO");
}

// Scoped to .factura-page so it doesn't leak into the admin layout.
const styles = `
@page { size: A4; margin: 0; }

.factura-page,
.factura-page * { box-sizing: border-box; margin: 0; padding: 0; }

.factura-page {
  width: 210mm;
  font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  color: #1a1a1a;
  background: #fff;
  min-height: 297mm;
  margin: 0 auto;
  position: relative;
  padding: 24mm 22mm 32mm 22mm;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
}

/* Decorative corners */
.factura-page .corner-tl { position: absolute; top: 0; left: 0; width: 14mm; height: 14mm; background: #F39C2D; }
.factura-page .corner-tl-tab { position: absolute; top: 14mm; left: 0; width: 4mm; height: 14mm; background: #F39C2D; }
.factura-page .corner-tr { position: absolute; top: 4mm; right: 0; width: 42mm; height: 16mm; background: #8BC34A; }
.factura-page .dash-right { position: absolute; top: 0; right: 5mm; height: 100%; border-right: 2px dashed #E74C3C; }

/* Footer */
.factura-page .footer-bar { position: absolute; bottom: 6mm; left: 0; right: 0; height: 5mm; background: #8BC34A; }
.factura-page .mtn-orange { position: absolute; bottom: 6mm; left: 0; width: 30mm; height: 16mm; background: #F39C2D; border-top-right-radius: 100% 100%; border-top-left-radius: 50% 100%; }
.factura-page .mtn-black { position: absolute; bottom: 6mm; left: 16mm; width: 34mm; height: 20mm; background: #2B2B2B; border-top-right-radius: 100% 100%; border-top-left-radius: 60% 100%; }

/* Header */
.factura-page header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10mm; position: relative; z-index: 2; }
.factura-page .brand { font-size: 44pt; font-weight: 900; letter-spacing: -1.5px; line-height: 1; color: #111; }
.factura-page .tagline { text-align: center; font-weight: 700; font-size: 11pt; margin-top: 8mm; margin-right: 48mm; line-height: 1.3; }

.factura-page hr.divider { border: none; border-top: 2px solid #B8B8B8; margin: 2mm 0 7mm 0; }

/* Title */
.factura-page .title-block { text-align: center; margin-bottom: 6mm; }
.factura-page .title-block h2 { font-size: 16pt; font-weight: 800; margin-bottom: 3mm; }
.factura-page .title-block .sub { font-size: 10pt; font-weight: 700; letter-spacing: 1.5px; }

/* Meta */
.factura-page .meta { display: flex; justify-content: space-between; font-size: 10pt; margin-bottom: 7mm; }
.factura-page .meta .left p { line-height: 1.55; }
.factura-page .meta .right { text-align: right; }
.factura-page .meta .right .line { display: inline-block; width: 18mm; height: 2px; background: #888; margin-bottom: 8mm; }

/* Items table */
.factura-page table.items { width: 100%; border-collapse: collapse; margin-bottom: 0; }
.factura-page table.items thead th { background: #3A3A3A; color: #fff; text-align: left; padding: 4.5mm 6mm; font-size: 10.5pt; font-weight: 700; letter-spacing: 1px; }
.factura-page table.items thead th:nth-child(2),
.factura-page table.items thead th:nth-child(3),
.factura-page table.items thead th:nth-child(4) { text-align: center; }
.factura-page table.items tbody td { padding: 5mm 6mm; font-size: 10.5pt; border-bottom: 1px solid #DADADA; border-left: 1px solid #DADADA; }
.factura-page table.items tbody td:last-child { border-right: 1px solid #DADADA; }
.factura-page table.items tbody td:nth-child(2),
.factura-page table.items tbody td:nth-child(3),
.factura-page table.items tbody td:nth-child(4) { text-align: center; }

/* Summary */
.factura-page .summary { display: flex; justify-content: space-between; margin-top: 8mm; align-items: flex-start; }
.factura-page .pay { font-size: 10pt; line-height: 1.7; max-width: 90mm; }
.factura-page .pay h3 { font-size: 14pt; font-weight: 800; margin-bottom: 4mm; }
.factura-page .totals { width: 75mm; }
.factura-page .totals .row { border: 1px solid #B8B8B8; padding: 4.5mm 6mm; font-weight: 800; font-size: 12pt; }
.factura-page .totals .row + .row { border-top: none; }

/* Logo bottom-right */
.factura-page .logo-wrap { position: absolute; bottom: 22mm; right: 18mm; width: 58mm; z-index: 3; }
.factura-page .logo-wrap img { width: 100%; height: auto; display: block; mix-blend-mode: multiply; }

@media print {
  .factura-page { box-shadow: none; }
}
`;

export default async function FacturaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("id", id)
    .maybeSingle();
  if (!order) notFound();

  const items = (order.items ?? []) as Item[];
  const date = new Date(order.created_at).toLocaleDateString("es-CO", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  // Aggregate quantities and totals per talla.
  const rows = SIZES.map((s) => {
    const itemsForSize = items.filter((i) => i.size === s);
    const quantity = itemsForSize.reduce((sum, i) => sum + i.quantity, 0);
    const unit_price = itemsForSize[0]
      ? Number(itemsForSize[0].unit_price)
      : CANONICAL_PRICES[s];
    const line_total = itemsForSize.reduce(
      (sum, i) => sum + Number(i.line_total),
      0,
    );
    return { size: s, quantity, unit_price, line_total };
  });

  const subtotal = rows.reduce((sum, r) => sum + r.line_total, 0);
  const total = Number(order.total);
  const shipping = Number(order.shipping ?? 0);
  const clientName = order.contact_name || `Pedido #${order.id.slice(0, 8)}`;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: styles }} />
      <div className="mb-4 flex justify-end print:hidden">
        <PrintButton />
      </div>

      <div className="factura-page">
        <div className="corner-tl"></div>
        <div className="corner-tl-tab"></div>
        <div className="corner-tr"></div>
        <div className="dash-right"></div>

        <header>
          <div className="brand">FAJICAT</div>
          <div className="tagline">
            Comodidad para tu
            <br />
            mascota
          </div>
        </header>

        <hr className="divider" />

        <div className="title-block">
          <h2>{clientName}</h2>
          <div className="sub">CUENTA DE COBRO</div>
        </div>

        <div className="meta">
          <div className="left">
            <p>Cel 3145602688</p>
            <p>mariana.rtp@gmail.com</p>
            <p>Medellín Ant.</p>
          </div>
          <div className="right">
            <span className="line"></span>
            <br />
            Fecha: {date}
          </div>
        </div>

        <table className="items">
          <thead>
            <tr>
              <th>TALLAS</th>
              <th>CANTIDAD</th>
              <th>PRECIO</th>
              <th>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.size}>
                <td>
                  {r.size === "XL" ? "Talla XL" : `Faja talla ${r.size}`}
                </td>
                <td>{r.quantity}</td>
                <td>{formatCOP(r.unit_price)}</td>
                <td>
                  {r.line_total === 0 ? "$0" : formatCOP(r.line_total)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">
          <div className="pay">
            <h3>Métodos de pago</h3>
            <p>Banco: Bancolombia</p>
            <p>cuenta ahorros # 33126948170</p>
          </div>
          <div className="totals">
            <div className="row">Subtotal: {formatCOP(subtotal)}</div>
            {shipping > 0 && (
              <div className="row">Envío: {formatCOP(shipping)}</div>
            )}
            <div className="row">Total: {formatCOP(total)}</div>
          </div>
        </div>

        <div className="logo-wrap">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.jpg" alt="Fajicat" />
        </div>

        <div className="mtn-orange"></div>
        <div className="mtn-black"></div>
        <div className="footer-bar"></div>
      </div>
    </>
  );
}
