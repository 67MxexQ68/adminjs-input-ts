import React from 'react'
import flat from 'flat'
import { BasePropertyProps, useCurrentAdmin, SortSetter, Filter, populator } from 'adminjs'
import { Box } from '@adminjs/design-system'
//const { SortSetter, Filter, populator } = require('adminjs');
//const AdminJS = require('adminjs');
//const flat = require('flat');

const Auth: React.FC<BasePropertyProps> = (props) => {
    return async (request, response, context) => {
        const { query } = request;
        const { sortBy, direction, filters = {} } = flat.unflatten(query || {});
        const { resource } = context;

        let { page = 1, perPage = 10 } = flat.unflatten(query || {});
        //perPage = +perPage > PER_PAGE_LIMIT ? PER_PAGE_LIMIT : +perPage;

        const listProperties = resource.decorate().getListProperties();
        const firstProperty = listProperties.find((p) => p.isSortable());
        const sort = firstProperty ? SortSetter({ sortBy, direction }, firstProperty.name(), resource.decorate().options) : null;

        /** @type {AdminJS.BaseRecord[]} */
        let records = [];
        let total = 0;

        // If filter by ID passed, then get item by ID
        if (filters._id) {
            records = await resource.findMany([filters._id]);
            total = records ? records.length : 0;
        }

        // Search and filter if id not passed
        else {
            const filter = await new Filter(filters, resource).populate();
            records = await resource.find(filter, {
                limit: perPage,
                offset: (page - 1) * perPage,
                sort,
            });
            total = await resource.count(filter);
        }

        const populatedRecords = (context.records = await populator(records));
        return {
            meta: {
                total,
                perPage,
                page,
                direction: sort.direction,
                sortBy: sort.sortBy,
            },
            records: populatedRecords.map((r) => r.toJSON(context.currentAdmin)),
        };
    }
}

export default Auth
