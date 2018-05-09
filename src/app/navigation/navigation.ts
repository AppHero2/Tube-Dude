export const navigation = [
    {
        'id'      : 'applications',
        'title'   : 'Main',
        'type'    : 'group',
        'children': [
            {
                'id'   : 'videos',
                'title': 'Videos',
                'type' : 'item',
                'icon' : 'message',
                'url'  : '/videos'
            },
            {
                'id'   : 'users',
                'title': 'Users',
                'type' : 'item',
                'icon' : 'people',
                'url'  : '/users'
            }
        ]
    }
];
