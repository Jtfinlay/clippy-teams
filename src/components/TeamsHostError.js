import React from 'react';

/**
 * This component displays an error message in the
 * case when a page is not being hosted within Teams.
 */
function TeamsHostError() {
    return (
        <div>
            <h3 className="Error">Ready to debug your app within Teams...</h3>
        </div>
    );
}

  export default TeamsHostError;