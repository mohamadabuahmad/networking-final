const { Recovery_Question } = require('./Recovery_Question.js');
const { Skill } = require('./Skill.js');
const { Friend } = require('./Friend.js');
const { Post } = require('./Post.js');
const { Notification } = require('./Notification.js');

class User {
    constructor({
        user_id,
        user_name,
        first_name,
        last_name,
        email,
        password,
        phone_number,
        education,
        recovery_q1,
        recovery_q2,
        skills = [],
        friends = [],
        posts = [],
        notifications = [],
        suggestions = [],
        photo
    }) {
        this.user_id = user_id;
        this.user_name = user_name;
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.password = password;
        this.phone_number = phone_number;
        this.education = education;
        this.recovery_q1 = new Recovery_Question(recovery_q1.question, recovery_q1.answer);
        this.recovery_q2 = new Recovery_Question(recovery_q2.question, recovery_q2.answer);
        this.skills = skills.map(skill => new Skill(skill));
        this.friends = friends.map(friend => new Friend(friend.user_id, friend.friend_id));
        this.posts = posts.map(post => new Post({
            user_id: post.user_id,
            post_id: post.post_id,
            post_content: post.post_content,
            post_date: post.post_date,
            likes: post.likes,
            comments: post.comments
        }));
        this.notifications = notifications.map(notification => new Notification(notification.notification_id, notification.user_id, notification.notification_content, notification.seen));
        this.suggestions = suggestions.map(suggestion => new User({
            user_id: suggestion.user_id,
            user_name: suggestion.user_name,
            first_name: suggestion.first_name,
            last_name: suggestion.last_name,
            email: suggestion.email,
            password: suggestion.password,
            phone_number: suggestion.phone_number,
            education: suggestion.education,
            recovery_q1: suggestion.recovery_q1,
            recovery_q2: suggestion.recovery_q2,
            skills: suggestion.skills,
            friends: suggestion.friends,
            posts: suggestion.posts,
            notifications: suggestion.notifications,
            suggestions: suggestion.suggestions,
            photo: suggestion.photo
        }));
        this.photo = photo;
    }

    toJSON() {
        return {
            user_id: this.user_id,
            user_name: this.user_name,
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            phone_number: this.phone_number,
            education: this.education,
            skills: this.skills.map(skill => skill.toJSON()),
            friends: this.friends.map(friend => friend.toJSON()),
            posts: this.posts.map(post => post.toJSON()),
            notifications: this.notifications.map(notification => notification.toJSON()),
            suggestions: this.suggestions.map(suggestion => suggestion.toJSON()),
            photo: this.photo
        };
    }
}

module.exports = { User };
