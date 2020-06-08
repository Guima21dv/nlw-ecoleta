import {Request, Response} from 'express'
import knex from '../database/connection'

export default class ItemController{
    async index(request: Request, response: Response) {
        const items = await knex('item').select('*')
    
        const serializedItems = items.map((item: any) => {
            return {
                id: item.id,
                title: item.title,
                image_url: `http://192.168.0.12:3333/assets/${item.image}`
            }
        })
    
        return response.json(serializedItems)
    }
}