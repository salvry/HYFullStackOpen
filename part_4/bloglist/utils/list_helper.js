const dummy = (blogs) => 1

const totalLikes = (blogs) => blogs.reduce((acc, curr) => acc + curr.likes, 0)

const favoriteBlog = (blogs) => {
    if(blogs.length === 0){
        return null
    }
    else {
        const favorite = blogs.reduce((acc, val) => {
            return acc.likes > val.likes ? acc : val
        })
        return favorite
    }
}

const mostBlogs = (blogs) => {
    if(blogs.length === 0){
        return null
    }
    const authors = Array.from(new Set(blogs.flatMap(blog => blog.author)))
    const blogCountsByAuthor = new Map()
    authors.map(author => blogCountsByAuthor.set(author, 0))
    blogs.map(blog => blogCountsByAuthor.set(blog.author, blogCountsByAuthor.get(blog.author)+1))
    const authorWithMostBlogs = [...blogCountsByAuthor.entries()].reduce((acc, curr) => acc[1] > curr[1] ? acc:curr)
    return {author: authorWithMostBlogs[0], blogs: authorWithMostBlogs[1]}
}

const mostLikes = (blogs) =>{
    if(blogs.length === 0){
        return null
    }
    const authors = Array.from(new Set(blogs.flatMap(blog => blog.author)))
    const blogLikesByAuthor = new Map()
    authors.map(author => blogLikesByAuthor.set(author, 0))
    blogs.map(blog => blogLikesByAuthor.set(blog.author, blogLikesByAuthor.get(blog.author) + blog.likes))
    const authorWithMostLikes = [...blogLikesByAuthor.entries()].reduce((acc, curr) => acc[1] > curr[1] ? acc:curr)
    return {author: authorWithMostLikes[0], likes: authorWithMostLikes[1]}
}
   
module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}