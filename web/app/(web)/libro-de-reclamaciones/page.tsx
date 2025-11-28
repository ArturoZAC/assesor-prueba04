import { BannerInterna } from "../@components/estructura/BannerInterna";
import { ContentMain } from "../@components/estructura/ContentMain";
import { Footer } from "../@components/estructura/Footer";
import { Header } from "../@components/estructura/Header";
import { LibroReclamacion } from "./@components/LibroReclamacion";

export default function page() {
  return (
    <>
      <Header />
      <BannerInterna
        banner="/images/slides/slide2.webp"
        title="Libro de reclamaciones"
      />
      <ContentMain className="py-20">
        <LibroReclamacion />
      </ContentMain>
      <Footer />
    </>
  );
}
