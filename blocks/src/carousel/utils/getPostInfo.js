export function getPostInfo(el) {
    const postIdPattern = new RegExp('post-(\\d+)');
                    
    // Find the class that matches the pattern
    const matchedClass = Array.from(el.classList).find((className) => postIdPattern.test(className));
    
    // If no match is found, return null
    if (!matchedClass) return null;

    // Extract the postId from the matched class name
    const postId = Number(matchedClass.match(postIdPattern)[1]);

    // Check for 'type-post' or 'type-page' class
    if (el.classList.contains('type-post')) {
        return { id: postId, type: 'post' };
    } 
    
    else if (el.classList.contains('type-page')) {
        return { id: postId, type: 'page' };
    }

    return null;
}