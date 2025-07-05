import fs from 'fs'
import path from 'path'

export function saveBase64Image(
    base64Image: string,
    filenamePrefix: string = 'image',
    saveDir: string = ''
): string {
    const matches = base64Image.match(/^data:(image\/\w+);base64,(.+)$/)
    if (!matches) throw new Error('Invalid base64 image string')

    const ext: string = matches[1].split('/')[1]
    const base64Data: string = matches[2]
    const buffer: Buffer = Buffer.from(base64Data, 'base64')

    const fileName: string = `${filenamePrefix}_${Date.now()}.${ext}`
    const uploadDir: string = path.join(__dirname, '../uploads', saveDir)

    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true })
    }

    const filePath: string = path.join(uploadDir, fileName)
    fs.writeFileSync(filePath, buffer)

    return `/uploads/${saveDir}/${fileName}`
}
