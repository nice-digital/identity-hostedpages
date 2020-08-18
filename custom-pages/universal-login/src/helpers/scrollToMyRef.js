export const scrollToMyRef = (ref, event) => {
  event.preventDefault();
  ref.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
  ref.current.focus({preventScroll: true});    
};

export default scrollToMyRef
