import { useState } from 'react';
import { css } from 'styled-system/css';
import { DropdownIcon } from '@/components/icons/DropdownIcon';

interface TeamMemberDropdownProps {
  onSetLeader?: () => void;
  onDeleteMember?: () => void;
}

interface CommentDropdownProps {
  onEditComment?: () => void;
  onDeleteComment?: () => void;
}

export const TeamMemberDropdown = ({
  onSetLeader,
  onDeleteMember,
}: TeamMemberDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleSetLeader = () => {
    onSetLeader?.();
    setIsOpen(false);
  };

  const handleDeleteMember = () => {
    onDeleteMember?.();
    setIsOpen(false);
  };

  return (
    <div className={dropdownWrapperStyle}>
      <button className={dropdownButtonStyle} onClick={handleToggle}>
        <div className={iconWrapperStyle(isOpen)}>
          <DropdownIcon />
        </div>
      </button>
      {isOpen && (
        <div className={dropdownContainerStyle}>
          <div className={dropdownItemStyle} onClick={handleSetLeader}>
            팀장 설정
          </div>
          <div className={dividerStyle} />
          <div className={dropdownItemStyle} onClick={handleDeleteMember}>
            팀원 삭제
          </div>
        </div>
      )}
    </div>
  );
};

export const CommentDropdown = ({
  onEditComment,
  onDeleteComment,
}: CommentDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleEditComment = () => {
    onEditComment?.();
    setIsOpen(false);
  };

  const handleDeleteComment = () => {
    onDeleteComment?.();
    setIsOpen(false);
  };

  return (
    <div className={dropdownWrapperStyle}>
      <button className={dropdownButtonStyle} onClick={handleToggle}>
        <div className={iconWrapperStyle(isOpen)}>
          <DropdownIcon />
        </div>
      </button>
      {isOpen && (
        <div className={dropdownContainerStyle}>
          <div className={dropdownItemStyle} onClick={handleEditComment}>
            댓글 수정
          </div>
          <div className={dividerStyle} />
          <div className={dropdownItemStyle} onClick={handleDeleteComment}>
            댓글 삭제
          </div>
        </div>
      )}
    </div>
  );
};

const dropdownWrapperStyle = css({
  position: 'relative',
  display: 'inline-block',
});

const dropdownButtonStyle = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
});

const iconWrapperStyle = (isOpen: boolean) =>
  css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
  });

const dropdownContainerStyle = css({
  position: 'absolute',
  top: 'calc(100% + 0.25rem)',
  right: 0,
  display: 'flex',
  flexDirection: 'column',
  borderRadius: '0.5rem',
  backgroundColor: 'white',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
  overflow: 'hidden',
  zIndex: 10,
});

const dropdownItemStyle = css({
  paddingX: '1rem',
  paddingY: '0.75rem',
  textStyle: 'body4.r',
  color: 'gray.700',
  cursor: 'pointer',
  transition: 'background-color 0.2s',
  whiteSpace: 'nowrap',
  _hover: {
    backgroundColor: 'gray.50',
  },
});

const dividerStyle = css({
  height: '1px',
  backgroundColor: 'gray.100',
});
