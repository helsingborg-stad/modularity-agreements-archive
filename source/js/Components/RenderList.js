const RenderList = ({paginatedItems}) =>
    <div className="accordion accordion-icon accordion-list">
        <ul>
            {paginatedItems.map(item => (
                <li  key={item.Id}
                     items={paginatedItems}>
                    {item.Name} {item.Id}
                </li>
            ))}
        </ul>
    </div>;

export default RenderList;