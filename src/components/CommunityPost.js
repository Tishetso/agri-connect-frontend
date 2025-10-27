import React from 'react';

function CommunityPost({ author, content }) {
    return (
        <div style={{ borderBottom: '1px solid #eee', padding: '10px' }}>
            <strong>{author}</strong>: {content}
        </div>
    );
}

export default CommunityPost;
