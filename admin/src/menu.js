let menuData = [
  {
      name: '概况',
      path: '/admin/home',
      icon: 'dashboard'
  },
  {
      name: '电影管理',
      icon: 'star',
      path: '/admin/film',
      children: [
          {
              name: '电影添加',
              path: '/admin/film/addFilm',
              icon: 'circle'
          },
          {
              name: '电影列表',
              path: '/admin/film/filmList',
              icon: 'circle'
          }
      ]
  },
  {
      name: '用户管理',
      icon: 'star',
      path: '/admin/user',
      children: [
          {
              name: '用户添加',
              path: '/admin/user/addUser',
              icon: 'circle'
          },
          {
              name: '用户列表',
              path: '/admin/user/userList',
              icon: 'circle'
          }
      ]
  },
{
    name: '权限管理',
    icon: 'star',
    path: '/admin/right',
    children: [
        {
            name: '添加角色',
            path: '/admin/right/addRole',
            icon: 'circle'
        },
        {
            name: '角色列表',
            path: '/admin/right/roleList',
            icon: 'circle'
        }
    ]
},
  {
    name: '影厅管理',
    icon: 'star',
    path: '/admin/room',
    children: [
        {
            name: '影厅添加',
            path: '/admin/room/newRoom',
            icon: 'circle'
        },
        {
            name: '影厅列表',
            path: '/admin/room/roomList',
            icon: 'circle'
        }
    ]
  },
  {
    name: '场次管理',
    icon: 'star',
    path: '/admin/arrange',
    children: [
        {
            name: '新建场次',
            path: '/admin/arrange/newArrange',
            icon: 'circle'
        },
        {
            name: '场次列表',
            path: '/admin/arrange/arrangeList',
            icon: 'circle'
        }
    ]
  },
{
    name: '轮播管理',
    icon: 'star',
    path: '/admin/carousel',
},
]			
export default menuData;