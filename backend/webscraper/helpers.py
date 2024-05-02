from bs4.element import Tag
from bs4 import BeautifulSoup

def get_next_sibling(html: Tag) -> Tag|None:
    """Get the next sibling of a tag."""
    next_sib = html.next_sibling
    if not next_sib:
        return None
    next_sib = next_sib.next_sibling
    if not next_sib:
        return None
    return next_sib

def tag_to_bs4(tag: Tag) -> BeautifulSoup:
    """Convert a tag to a BeautifulSoup object."""
    return BeautifulSoup(str(tag), "html.parser")
