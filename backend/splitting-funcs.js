
export function calculateBill(items, n_to_split) {
    let bill = 0;
    for (let i = 0; i < items.length; ++i) {
        if (items[i].selected) {
            bill += items[i].price;
        }
    }

    return (bill / n_to_split)
}