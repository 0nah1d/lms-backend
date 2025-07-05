import { FilterQuery, Model } from 'mongoose'

interface PaginationOptions {
    model: Model<any>
    query?: FilterQuery<any>
    sort?: any
    page?: number
    limit?: number
    populate?: string[]
    baseUrl?: string
    originalQuery?: Record<string, any>
}

export const paginate = async ({
    model,
    query = {},
    sort = {},
    page = 1,
    limit = 10,
    populate = [],
    baseUrl = '',
    originalQuery = {},
}: PaginationOptions) => {
    const skip = (page - 1) * limit

    const dataQuery = model.find(query).sort(sort).skip(skip).limit(limit)
    for (const field of populate) {
        dataQuery.populate(field)
    }

    const [results, count] = await Promise.all([
        dataQuery.exec(),
        model.countDocuments(query),
    ])

    const totalPage = Math.ceil(count / limit)

    const queryString = new URLSearchParams({
        ...Object.fromEntries(
            Object.entries(originalQuery).filter(
                ([key, value]) =>
                    key !== 'page' && key !== 'limit' && value !== undefined
            )
        ),
    }).toString()

    const buildLink = (targetPage: number) =>
        `${baseUrl}?${queryString}&page=${targetPage}&limit=${limit}`

    return {
        count,
        page,
        page_size: limit,
        total_page: totalPage,
        next: page < totalPage ? buildLink(page + 1) : null,
        previous: page > 1 ? buildLink(page - 1) : null,
        results,
    }
}
