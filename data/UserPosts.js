import {USERS} from './Users'
export const POSTS = [
    {
        imageUrl :'https://content.jdmagicbox.com/comp/medak/s1/9999p8452.8452.170925075458.j3s1/catalogue/jntuh-college-of-engineering-sultanpur-academic-zone-medak-universities-wy4478bduo.jpg',
        user : USERS[0].user,
        likes : 189,
        caption : 'Weather at JNTUHCES is soo satisfying #hostel_life',
        profile_picture : USERS[0].image,
        comments : [
            
        ]
    },
    {
        imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSyFqI6gwIsNEcyLkF0aTVt-fZWxx2XpmXcCA&usqp=CAU',
        user: USERS[1].user,
        likes: 1000,
        caption: 'Here is the new CSE logo for the fest #Yuga',
        profile_picture: USERS[1].image,
        comments: [
            {
                user: USERS[0].user,
                comment: 'slay',
            },
            {
                user: USERS[1].user,
                comment: 'thankyou'
            }
        ]
    },
    {
        imageUrl: 'https://lh3.googleusercontent.com/proxy/eYG6NGufW17anPcHaGHNJ5ezV9AQhdLc2au6oE7PQJd3xD3uPs1l33uHPeClcO0mH4ujBBAEVUZwhLavL9tJIfqJwVBw',
        user: USERS[0].user,
        likes: 250,
        caption: 'Honorable Health minister visited our campus',
        profile_picture: USERS[0].image,
        comments: [
            {
                user: USERS[1].user,
                comment: 'WOW',
            }
        ]

    }
]