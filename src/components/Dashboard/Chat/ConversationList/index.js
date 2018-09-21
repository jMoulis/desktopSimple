import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Wrapper from '../Wrapper';
import UserIconContainer from '../../../../Modules/UserIcon';
import './index.css';

const ConversationList = ({ conversations, loggedUser, callback, ...rest }) => {
  return (
    <Wrapper reduceOnMount>
      <div className={`conversation-list`}>
        {conversations &&
          conversations.map(conversation => (
            <Fragment key={conversation._id}>
              {conversation.users.map(user => {
                if (user._id !== loggedUser._id)
                  return (
                    <UserIconContainer
                      key={user._id}
                      user={{ user }}
                      name
                      callback={() => callback({ receiver: user })}
                      active={false}
                    />
                  );
              })}
            </Fragment>
          ))}
      </div>
    </Wrapper>
  );
};

ConversationList.propTypes = {
  conversations: PropTypes.array.isRequired,
  loggedUser: PropTypes.object.isRequired,
  callback: PropTypes.func.isRequired,
};

export default ConversationList;
