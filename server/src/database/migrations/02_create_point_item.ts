import Knex from 'knex'

export async function up(knex: Knex) {
    //CRIAR A TABELA POINTS
    return knex.schema.createTable('point_item', table => {
        table.increments('id')
            .primary()
        table.integer('point_id')
            .notNullable()
            .references('id')
            .inTable('point')
        table.integer('item_id')
            .notNullable()
            .references('id')
            .inTable('item')
    })
}

export async function down(knex: Knex) {
    //REMOVER A TABELA POINTS
    return knex.schema.dropTable('item')
}