function Summary({ summary }) {
  return (
    <div>
      <h2>Resumen</h2>
      <p>Total: {summary.total}€</p>
      <ul>
        {Object.entries(summary.by_category).map(([category, amount]) => (
          <li key={category}>
            {category}: {amount}€
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Summary;
