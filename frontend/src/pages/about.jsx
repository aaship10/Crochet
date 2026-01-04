import Footer from './components/footer';
import img1 from '/p1-1.jpeg';

function About() {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex-grow'>
        <div className='flex flex-col justify-center items-center p-8 gap-8'>
          <h1 className='text-5xl font-extrabold'>About Us</h1>
          <img src={img1} className='w-2/3 rounded-lg shadow-md' />
          <p className='text-lg text-center max-w-4xl'>
            Welcome to our Crochet Shop! We are passionate about creating beautiful, handcrafted crochet items that bring joy and warmth to your life. Each piece is made with love and attention to detail, ensuring the highest quality for our customers. Whether you're looking for a cozy blanket, a stylish accessory, or a unique gift, we have something special for everyone. Thank you for supporting our small business and allowing us to share our craft with you!
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default About;