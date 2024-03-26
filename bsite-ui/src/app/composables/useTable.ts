export function useTable() {

    const setQueryUrl = (path: string, { page, itemsPerPage, sortBy, search }: any) => {
        let queryUrl = `${path}?page=${page}&perPage=${itemsPerPage}`
        if (sortBy.length) {
            const sortKey = sortBy[0].key
            const sortOrder = sortBy[0].order
            queryUrl += `&sortBy=${sortKey}&sortType=${sortOrder}`
        }
        if(search.value && search.value.trim() !=='') {
            queryUrl += `&${search.key}=${search.value}`
        }
        return queryUrl
    }

    return { setQueryUrl }
}