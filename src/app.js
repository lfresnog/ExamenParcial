// let nfilm = result.url.match(/(\d+)/); 
// urlstar = parseInt(urlstar);


import { fetchData } from './fetchdata';
import { GraphQLServer } from 'graphql-yoga';

// rickymorty entry point
const url = 'https://swapi.co/api/people/';



/**
 * Main App
 * @param data all Star Wars database
 */
const runApp = data => {
    const typeDefs = 
    `
    type Query {
      people(page:Int,number:Int,name:String,gender:String):[People]
      character(id:Int!):People
    }

    type People{
        name:String!
        gender:String!
        url:String!
        films:[Film]
    }

    type Film{
        titulo:String!
        episodio:Int!
    }
    `
    const resolvers = {
        Query:{
            people:(parent,args,ctx,infor) => {
                const page = args.page || 1;
                const number = args.number || 10;
                let found=data;
                if(args.name)
                    //found = data.filter(elem => elem.name.slice(0,(args.name.lenght)+1) === args.name);
                    found = data.filter(elem => elem.name.includes(args.name||elem.name));
                if(args.gender)
                    found = data.filter(elem => elem.gender === args.gender);
                found = found.slice((page-1)*number, ((page-1)*number)+(number));
                return found.map(elem => {
                    return{
                      name: elem.name, 
                      gender: elem.gender, 
                      url: elem.url,
                    }
                  })
            },
            character:(parent,args,ctx,infor) => {
                return{
                    name:data[args.id-1].name,
                    gender:data[args.id-1].gender,
                    url:data[args.id-1].url,
                }
            }
        }
}
    const server = new GraphQLServer({typeDefs,resolvers});
    server.start({port:"3003"});
};

// main program
fetchData(runApp, url);

