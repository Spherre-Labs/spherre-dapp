from spherre.app.models.account import Member


class MemberService:
    @classmethod
    def get_member_by_address(cls, address: str) -> Member | None:
        """
        Get a member by their address
        """
        return Member.query.filter_by(address=address).one_or_none()

    @classmethod
    def update_member_email(cls, member_address: str, new_email: str) -> Member | None:
        """
        Update the email of a member
        """
        member = Member.query.filter_by(address=member_address).one_or_none()
        if not member:
            return None
        member.email = new_email
        member.save()
        return member

    @classmethod
    def get_or_create_member(cls, member_address: str, **kwargs) -> Member:
        """
        Get or create a member by their address and email
        """
        member = Member.get_or_create(address=member_address, **kwargs)
        return member
