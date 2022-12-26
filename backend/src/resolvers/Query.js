const makeName = (name, friend) => {
  return [name, friend].sort().join('_');
}

const Query = {
  
  chatbox: async(parent, {name1, name2}, {ChatBoxModel}) => {
    let boxName = makeName(name1, name2);
    let box = await ChatBoxModel.findOne({name: boxName});
    if(!box){
      box = await new ChatBoxModel({name: boxName}).save();
    }
    return box;
  }
  // // resolvers (methods)
  // users(parent, args, { db }, info) {
  //   if (!args.query) {
  //     return db.users;
  //   }

  //   return db.users.filter((user) => {
  //     return (user.name.toLowerCase().includes(args.query.toLowerCase()) && user.age >= args.age);
  //   });
  // },
  // posts(parent, args, { db }, info) {
  //   if (!args.query) {
  //     return db.posts;
  //   }

  //   return db.posts.filter((post) => {
  //     const isTitleMatch = post.title
  //       .toLowerCase()
  //       .includes(args.query.toLowerCase());
  //     const isBodyMatch = post.body
  //       .toLowerCase()
  //       .includes(args.query.toLowerCase());
  //     return isTitleMatch || isBodyMatch;
  //   });
  // },
  // comments(parent, args, { db }, info) {
  //   return db.comments;
  // },
  // me() {
  //   return {
  //     id: '123098',
  //     name: 'Mike',
  //     email: 'mike@example.com',
  //   };
  // },
  // post() {
  //   return {
  //     id: '092',
  //     title: 'GraphQL 101',
  //     body: '',
  //     published: false,
  //   };
  // },
};

export { Query as default };
