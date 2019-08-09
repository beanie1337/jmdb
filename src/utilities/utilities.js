
export function formatCurrency(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export function getGenres(genres) {
    var g = []
    Object.entries(genres).forEach((x) => {
        g.push(x[1].name)
    })

    return g;
}