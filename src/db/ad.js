import Model from './model'

const Ad = Model({
    tableName: 'ads',
    columns: {
        userId: ['user_id', 'text'],
        title: ['name', 'text'],
        description: ['description', 'text'],
        address: ['address', 'text'],
        hours: ['hours', 'text'],
        imageId: ['image_id', 'text']
    }
})

export default Ad
