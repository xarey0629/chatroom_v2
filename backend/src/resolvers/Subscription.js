const makeName = (name, friend) => {
  return [name, friend].sort().join('_');
}

const Subscription = {
  message: {
    // subscribe is a method under this message object.
    subscribe: (parent, {from, to}, {pubsub}) => {
      const chatBoxName = makeName(from, to);
      console.log("Someone is subscribing to: ", chatBoxName);

      // subInfo = pubsub.subscribe(`chatbox ${chatBoxName}`);
      console.log("Pub Info: ", pubsub.subscribe(`chatbox ${chatBoxName}`));
      return pubsub.subscribe(`chatbox ${chatBoxName}`); // subscribe tag "chatBox Ed_Elsie".
    },
  },

  // comment: {
  //   subscribe(parent, { postId }, { db, pubsub }, info) {
  //     const post = db.posts.find(
  //       (post) => post.id === postId && post.published,
  //     );

  //     if (!post) {
  //       throw new Error('Post not found');
  //     }

  //     return pubsub.asyncIterator(`comment ${postId}`); //
  //   },
  // },
  // post: {
  //   subscribe(parent, args, { pubsub }, info) {
  //     return pubsub.asyncIterator('post'); //
  //   },
  // },
};

export { Subscription as default };
