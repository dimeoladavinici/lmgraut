function Filters({ search, onSearchChange, estado, onEstadoChange, anio, onAnioChange }) {
    return (
        <section className="filters">
            <input
                type="text"
                className="input"
                placeholder="Buscar por modelo o marca"
                value={search}
                onChange={(e) => onSearchChange(e.target.value)}
            />
            <select
                className="select"
                value={estado}
                onChange={(e) => onEstadoChange(e.target.value)}
            >
                <option value="todos">Todos</option>
                <option value="EN STOCK">En stock</option>
                <option value="VENDIDO">Vendidos</option>
            </select>
            <input
                type="number"
                className="input"
                placeholder="Año mínimo"
                value={anio}
                onChange={(e) => onAnioChange(e.target.value)}
            />
        </section>
    );
}

export default Filters;
