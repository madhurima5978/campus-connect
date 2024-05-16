import {USERS} from './Users'
export const EVENTS = [
    {
        eventName: 'Tech Summit 2024',
        desc: `
                            🚀 **About the Event:**

      Join us for InnovateX 2024, a dynamic and exhilarating event that brings together students, faculty, and industry professionals for a celebration of innovation, creativity, and knowledge-sharing. This year, we are thrilled to showcase groundbreaking ideas, foster collaboration, and inspire the next generation of thought leaders.
  
      🌐 **Theme: Breaking Boundaries, Shaping Tomorrow**
      InnovateX 2024 is centered around the theme of "Breaking Boundaries, Shaping Tomorrow." Participants will explore the realms of technology, science, arts, and entrepreneurship, gaining insights into cutting-edge developments that have the potential to reshape our future. `,
    user : USERS[0].user,
        profile_picture : USERS[0].image,
        
        location: 'Convention Center',
        date: '2024-05-15',
        time: '10:00 AM',
        registrations: '20',
        attendees: [
            {
                user: USERS[0].user,
                profile_picture: USERS[0].image,
            },
            {
                user: USERS[1].user,
                profile_picture: USERS[1].image,
            }
        ]
    },
    {
        eventName: 'Hackathon Challenge',
        desc:`JNTU sultanpur hackahon challenge register below`,
        user : USERS[1].user,
        profile_picture : USERS[1].image,
        imageUrl: 'https://lh3.googleusercontent.com/proxy/ma7k0LgEO-GEYWDoo_sDpBVlgiLf48isKGDO02Yo-JHur20yMOOs8UVn3fcSOh0OT_ndSYNfRtOcTSrcXi6lWhhW6B59aEkWQaYWbSYFR_n1qj5CNZunjEyGKzBQ1AEgO4scp_O_gzqfJTQCMpmAwgY7M4CENCHDBNsF033_nx1BqBOU9A',
        location: 'Innovation Hub',
        date: '2024-06-02',
        time: '2:30 PM',
        registrations: '40',
        attendees: [
            {
                user: USERS[0].user,
                profile_picture: USERS[0].image,
            },
            {
                user: USERS[1].user,
                profile_picture: USERS[1].image,
            }
        ]
    },
    // Add more events as needed
];
