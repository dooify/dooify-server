import Model from './model'

const Session = Model({
    tableName: 'sessions',
    columns: {
        userId: ['user_id', 'text']
    }
})

export default Session
