
export default class Utils {
    static userURL(user_id) {
        return "http://www.nicovideo.jp/user/" + user_id;
    }
    static communityURL(community_id) {
        return "http://com.nicovideo.jp/community/" + community_id;
    }
    static broadcastURL(broad_id) {
        return "http://live.nicovideo.jp/watch/" + broad_id;
    }
}
