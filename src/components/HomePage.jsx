import useCategory from '../hooks/useCategory';
import Slider from './Slider';
import Hero from './Hero';
import Skills from './Skills';
import Contact from './Contact';
import Faq from './Faq';

function HomePage() {
  const [category] = useCategory();
  console.log(category);
  return (
    <div className="container mx-auto px-4 py-8">
      <Hero/>
      <Slider/>
      <Skills/>
      <Faq/>
      <Contact/>
    </div>
  );
}

export default HomePage;