import React from 'react';
import { shallow } from 'enzyme';
import { MembersViewContainer } from '../MembersViewContainer';
import FilteredMembersList from '../FilteredMembersList';
import memberService from '../../services/memberService';

describe('MembersViewContainer', () => {
  let onActivityStart;
  let onActivitySuccess;
  let onActivityFailure;
  let membersViewContainer;
  let memberToDelete;
  let updatedSpy;

  beforeEach(() => {
    spyOn(memberService, 'deleteMember').and.returnValue(Promise.resolve());
    onActivityStart = jasmine.createSpy('onActivityStart');
    onActivitySuccess = jasmine.createSpy('onActivitySuccess');
    onActivityFailure = jasmine.createSpy('onActivityFailure');
    updatedSpy = jasmine.createSpy();
    const callbacks = { onActivityStart, onActivitySuccess, onActivityFailure };
    memberToDelete = { id: '1' };
    const members = [{ id: '0' }, memberToDelete, { id: '2' }];

    membersViewContainer = shallow(
      <MembersViewContainer
        members={members}
        {...callbacks}
        branchId={'7'}
        membersUpdated={updatedSpy}
      />
    );
  });

  describe('deleting a member', () => {
    it('calls the activity start callback, and the member service', () => {
      membersViewContainer.find(FilteredMembersList).props().onDeleteMember(memberToDelete);
      expect(onActivityStart).toHaveBeenCalled();
      expect(memberService.deleteMember).toHaveBeenCalledWith('1', '7');
    });

    it('updates state and calls the activity success callback when deletion succeeds', done => {
      membersViewContainer.find(FilteredMembersList).props().onDeleteMember(memberToDelete).then(() => {
        expect(updatedSpy).toHaveBeenCalled();
        expect(onActivitySuccess).toHaveBeenCalled();
        expect(onActivityFailure).not.toHaveBeenCalled();
        done();
      });
    });

    it('calls the activity failure callback when deletion fails', done => {
      memberService.deleteMember.and.returnValue(Promise.reject());
      membersViewContainer.find(FilteredMembersList).props().onDeleteMember(memberToDelete).then(() => {
        expect(onActivitySuccess).not.toHaveBeenCalled();
        expect(onActivityFailure).toHaveBeenCalled();
        done();
      });
    });
  });
});
