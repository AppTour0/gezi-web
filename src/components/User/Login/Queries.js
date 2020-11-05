import gql from 'graphql-tag';

export const userByEmail = gql` 
    query getUser($email:String!){
        usuarios(where: {email: {_eq: $email}}) {
            email
            id
            password
            level
            google
            facebook
            photo_url
            active
            client{
                id
                name
                last_name
            }
            enterprise{
                id
                nome
                sobrenome
            }
        }
    }
`;