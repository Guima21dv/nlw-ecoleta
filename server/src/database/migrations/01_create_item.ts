import Knex from 'knex'

export async function up(knex: Knex){
    //CRIAR A TABELA POINTS
    return knex.schema.createTable('item', table => {
        table.increments('id').primary()
        table.string('image').notNullable()
        table.string('title').notNullable()
    })
}

export async function down(knex: Knex){
    //REMOVER A TABELA POINTS
    return knex.schema.dropTable('item')
}