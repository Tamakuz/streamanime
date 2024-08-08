import NavbarReuseble from "@/components/reuseble/navbar-reuseble";
import AnimeList from "@/components/home/anime-list";
import GenreList from "@/components/home/genre-list";

export default function Home() {return (
    <main>
      <NavbarReuseble />
      <div className="container grid grid-cols-12 gap-3 pb-10">
        {/* <AnimeList /> */}
        {/* <GenreList /> */}
      </div>
    </main>
  );
}
