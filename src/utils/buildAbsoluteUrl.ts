import { Request } from 'express'

export function buildAbsoluteUrl(req: Request, relativePath: string): string {
    const baseUrl: string = `${req.protocol}://${req.get('host')}`
    return `${baseUrl}${relativePath}`
}
