import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import './Table.css';

const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = useState(config);

    const sortedItems = useMemo(() => {
        let sortableItems = [...items];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [items, sortConfig]);

    const requestSort = (key) => {
        let direction = 'ascending';
        if (
            sortConfig &&
            sortConfig.key === key &&
            sortConfig.direction === 'ascending'
        ) {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    return { items: sortedItems, requestSort, sortConfig };
};

function Table() {
    const [data, setData] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        setLoader(true);
        const url = 'https://raw.githubusercontent.com/epsilon-ux/code-challenge-resources/main/cookies.json';
        (async () => {
            const result = await axios(url);
            setData(result.data.cookies);
            setLoader(false);
        })();
    }, [])

    const { items, requestSort, sortConfig } = useSortableData(data);
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    return (
        loader ? (
            <div>Loading...</div>
        ) : (
            <table>
                <thead>
                    <tr>
                        <th onClick={() => requestSort('name')} className={getClassNamesFor('name')}>Product Name</th>
                        <th onClick={() => requestSort('price')} className={getClassNamesFor('price')}>Price</th>
                        <th onClick={() => requestSort('category')} className={getClassNamesFor('category')}>Category</th>
                    </tr>
                </thead>
                <tbody>
                    {items.length > 0 && items.map((item, idx) => {
                        return (
                            <tr key={idx}>
                                <td className="product_name">{item.name}</td>
                                <td>{item.price}</td>
                                <td className="product_category">{item.category}</td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        )
    );
}

export default Table;
