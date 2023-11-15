import User from './User'
import Bookmark from './Bookmark'
import Category from './Category'
import Comment from './Comment'
import CommentDetail from './CommentDetail'
import Follow from './Follow'
import Google from './Google'
import GoogleUserDetail from './GoogleUserDetail'
import Like from './Like'
import New from './New'
import NormalUserDetail from './NormalUserDetail'
import Role from './Role'
import Topic from './Topic'
import TopicDetail from './TopicDetail'
import sequelize from './Sequelize'

sequelize.sync({ force: false }).then(() => {
  console.log('Database synchronized')
})

export {
  User,
  Bookmark,
  Comment,
  CommentDetail,
  Follow,
  Category,
  Google,
  GoogleUserDetail,
  Like,
  New,
  NormalUserDetail,
  Role,
  Topic,
  TopicDetail,
  sequelize,
}
