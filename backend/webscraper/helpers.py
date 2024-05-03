from bs4.element import Tag


def get_next_sibling(html: Tag) -> Tag | None:
    """Get the next sibling of a tag."""
    next_sib = html.next_sibling
    if not next_sib:
        return None
    next_sib = next_sib.next_sibling
    if not next_sib:
        return None
    return next_sib
