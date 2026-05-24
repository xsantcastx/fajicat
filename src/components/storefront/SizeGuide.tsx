const ROWS = [
  { talla: "XS", largo: "18 – 22 cm", contorno: "20 – 26 cm" },
  { talla: "S", largo: "23 – 28 cm", contorno: "27 – 34 cm" },
  { talla: "M", largo: "29 – 34 cm", contorno: "35 – 42 cm" },
  { talla: "L", largo: "35 – 40 cm", contorno: "43 – 50 cm" },
  { talla: "XL", largo: "41 – 48 cm", contorno: "51 – 60 cm" },
];

export function SizeGuide() {
  return (
    <section className="mt-14 rounded-3xl border border-ink/10 bg-white p-6 sm:p-8">
      <h2 className="text-2xl font-bold text-ink">¿Cómo medir a tu mascota?</h2>
      <p className="mt-2 text-ink/70">
        Para elegir la talla correcta, mide a tu mascota con una cinta métrica:
      </p>
      <ul className="mt-4 space-y-2 text-ink/70">
        <li>
          <b>Largo de espalda:</b> desde la base del cuello hasta el inicio de la
          cola.
        </li>
        <li>
          <b>Contorno del pecho:</b> la parte más ancha del tórax, justo detrás de
          las patas delanteras.
        </li>
      </ul>
      <div className="mt-6 overflow-hidden rounded-2xl border border-ink/10">
        <table className="w-full text-sm">
          <thead className="bg-cream text-left text-ink/60">
            <tr>
              <th className="px-4 py-3">Talla</th>
              <th className="px-4 py-3">Largo espalda</th>
              <th className="px-4 py-3">Contorno pecho</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/10">
            {ROWS.map((r) => (
              <tr key={r.talla}>
                <td className="px-4 py-3 font-semibold text-brand-orange">
                  {r.talla}
                </td>
                <td className="px-4 py-3">{r.largo}</td>
                <td className="px-4 py-3">{r.contorno}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-ink/50">
        * Medidas de referencia. Si tu mascota está entre dos tallas, elige la
        más grande o escríbenos por WhatsApp y te ayudamos.
      </p>
    </section>
  );
}
