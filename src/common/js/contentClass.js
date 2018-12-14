/**
 * Created by sjs-fqy on 2017/7/26.
 */
export default class contentClass {
  constructor ({id, avatar, nickName, createtime, remarks, isUpvote, upvoteNum, circleDetail, imgFile}) {
    this.id = id
    this.avatar = avatar
    this.nick_name = nickName
    this.createtime = createtime
    this.remarks = remarks
    this.is_upvote = isUpvote
    this.upvote_num = upvoteNum
    this.circle_detail = circleDetail
    this.img_file = imgFile
  }
}
