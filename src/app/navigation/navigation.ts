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
                'icon' : 'video_library',
                'url'  : '/videos'
            },
            {
                'id'   : 'oneVideo',
                'title': 'ONE video',
                'type' : 'item',
                'icon' : 'ondemand_video',
                'url'  : '/one-video'
            }
        ]
    }
];
