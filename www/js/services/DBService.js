/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
//(function () {
    
    function ok ()
    {
        console.log('ok');
    }
    
    function error (transaction, error) 
    {
      alert ("DB error : " + error.message);
      return false;
    }
    
    var DBService = function (reset){

        this.db = openDatabase("MyDB", "1.0", "MyDB", 2 * 1024 * 1024);
        
        if(reset){
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE status";
              transaction.executeSql (sql, undefined, ok, error);
            });
            
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE sephirah";
              transaction.executeSql (sql, undefined, ok, error);
            });
            
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE path";
              transaction.executeSql (sql, undefined, ok, error);
            });
            
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE weekdays";
              transaction.executeSql (sql, undefined, ok, error);
            });
            
            this.db.transaction (function (transaction) 
            {
              var sql = "DROP TABLE ephemeris";
              transaction.executeSql (sql, undefined, ok, error);
            });
        }
        
        
        //Create the status table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS status " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "property VARCHAR(100) NOT NULL, " + 
              "value VARCHAR(100) NOT NULL)";
          transaction.executeSql (sql, undefined, ok, error);
        });

        //Create the spherira table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS sephirah " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "name VARCHAR(100) NOT NULL, " + 
              "number INTEGER NOT NULL, " + 
              "primary_title VARCHAR(100), " +
              "other_titles TEXT, " +
              "intelligible_qualities TEXT, " +
              "human_experience TEXT, " +
              "sensible_qualities TEXT, " +
              "color_tree VARCHAR(100), " +
              "color_scale VARCHAR(100), " +
              "elemental_attribution VARCHAR(100), " +
              "polarity VARCHAR(100), " +
              "tarot_card VARCHAR(100), " +
              "commentary TEXT)";
          transaction.executeSql (sql, undefined, ok, error);
        });

        //Create the paths table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS path " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "number INTEGER NOT NULL, " + 
              "sephirah_1 INTEGER NOT NULL, " + 
              "sephirah_2 INTEGER NOT NULL, " + 
              "name VARCHAR(100) NOT NULL, " +
              "alphabet_position INTEGER, " +
              "symbolic_meaning TEXT, " +
              "occult_concept TEXT, " +
              "attribute TEXT, " +
              "tarot_attribution TEXT " +
              ")";
          transaction.executeSql (sql, undefined, ok, error);
        });

        //Create the status table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS weekdays " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "name VARCHAR(100) NOT NULL, " + 
              "planet VARCHAR(100) NOT NULL, " + 
              "sephirah VARCHAR(100) NOT NULL)";
          transaction.executeSql (sql, undefined, ok, error);
        });

        //Create the ephemeris table
        this.db.transaction (function (transaction) 
        {
          var sql = "CREATE TABLE IF NOT EXISTS ephemeris " +
              " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
              "date TEXT NOT NULL, " + 
              "sunrise TEXT NOT NULL, " +
              "sunset TEXT NOT NULL)";
          transaction.executeSql (sql, undefined, ok, error);
        });

    };
        
    DBService.prototype.fillDB = function (){

        //Can retrieve information from a distant db my synchronization..
        var sephiroh = new Array();
        sephiroh[0] = ["Kether",
            1,
            "Crown",
            "the Inscrutable Monad,the Macroposopus which, according to the Zohar,\n\
is The Great Countenance; in terms of the Christian trinity-theology and Neoplatonic cosmology from which the Cristian \n\
idea of the Trinity was derived, Kheter is the Father, or the First Existence; also The Ancient of Ancient; The Ancient of Days;\n\
The Head which is not; according to the Sepher Yetzirah, the Admirable of Hidden Intelligence; the Primordial Point.",
            "the Primum Mobile, or that which is called the Beginnings of Turnings.",
            "The First Cause; the Root of all things; the Unity that was, is, and will be, and from which all else proceeds",
            "Union with God",
            "As assigned by humankind for magical purposes, the God of the physical universe; the divine component, \n\
            or the spark of divinity within individual; the spiritual essence of the individual.",
            "White",
            "In Atziluth, pure brillance. In Briah, its color appears as a brillant white. \n\
            In Yetzirah, the pure brillant white remains. In Assiah, the brillant white becomes flecked with bright gold.",
            "Air.",
            "None",
            "the Four Aces of the Lesser Arcana, being one from each of the Four Suits.",
            "The idea of polarity on the Tree can cause no small amount of confusion. First off, it must be remembered that\n\
            the Sephiroth are states of existence, not physical points, positions, or stations. Neither do they occupy some\n\
            portion of space 'out there' in the universe. Yet this 'polarity' is interpreted in humain terms to be something\n\
            with which the mind can identify. In this case, positive or negative, masculine or feminine, force or form.\n\
            Since Kether is the 'I AM' state of existence, it contains all potential, yet, as Dion Fortune states in her book,\n\
             'The Mystical Qabalah': Kether... is pure being, all-potential, but not active... Wherever there is a state of pure, \n\
            unconditioned being, without parts or activities, it is referred to Kether. But earlier I mentioned that Kether is \n\
            ever in motion, so how can this be? In theological and theosophical fact, neither Fortune's comments nor mine contradict\n\
            each other, owing to the state that Kether is in at any given moment, to use the human construct of time. \n\
            In its potential changes to a kinetic state, it becomes ever in motion.\n\
            In fact, the definitions that the science of physics gives to these two states is highly applicable here: \n\
            potential, meaning the energy of position, that is, a placement or state without motion; and kinetic, meaning the\n\
            energy of motion. In brief, while this Sephirah lacks polarity, yet it gives rise to polarities of positive and \n\
            negative, masculine and feminine, male and female, through its projections of the other nine Sephiroth.\n\
            Such is a characteristic of its Intelligible and incomprehensive nature."];
        
        sephiroh[1] = ["Chokmah",
            2,
            "Wisdom",
            "In Christian trinity-theology and Neoplatonic cosmology, Chokmah is the Son. In Kabbalistic theosophy, the title\n\
            of Father is assigned to this Sephirah; the Supernal Father; the Second Supernal.",
            "the Zodiac. Chokmah is also assigned the planet Uranus as an attribution, but this is not typically used in Occult\n\
            and Magical work.",
            "that Divine Wisdom which is beyong human comprehension; the Illuminating Intelligence; that energetic, dynamic, all\n\
            conscious force underlying existence.",
            "the Vision of God",
            "Wisdom of the most subtle, profound type, of which humankind is capable of comprehending; the essential impulse\n\
            behind the very essence of intellectualism; the Will that exists beyound one's personal, individual will, and which\n\
             is the Divine Will within individual. Magically, it is the 'True Will' of the aspirant: the part of the Will of God\n\
            seeking to express itself in the world through the individual. It is also the Chiah, the ernergy of the eternal part of \n\
            the Self.",
            "Gray",
            "In the World of Atziluth, Chokmah is an unadulterated, soft blue. In Briah, gray. In Yetzirah, a pearl gray that\n\
            exibits rainbow-like reflections. In Assiah, the color is a soft white, flecked with red, blue, and yellow.",
            "Fire",
            "Chokmah is the primary positive, masculine, and active power of the Tree. It sits at the summit of what is called \n\
             the Pillar of Mercy on the right side of the glyph of the Tree of Life. As such, it is the active dynamism of the Tree \n\
             (but with the understanding given in the Commentary below.)",
            "The Four Twos of the Lesser Arcana, being one from each of the Four Suits.",
            "The Four Twos of the Tarot's Lesser Arcana representing Chkmah, can indeed represent a dynamic force, positive and masculine \n\
            in nature. But according to the Kabbalists, this is only true for Chokmah on the subtle planes of existence, owing \n\
            to its being the second Sephirah of the three Supernals of the Supernal Triad of the Tree: Kether being the first \n\
            Supernal, and Binah the third. When the Chokmah influence appears on the less subtle planes of form however, its \n\
            force is negative. That is, it lends equilibrium to the world of form through its dual polarity-aspect."];
        
        sephiroh[2] = ["Binah",
            3,
            "Understanding",
            "The Great Mother; the Great Sea; The Universal Root Substance which our senses are in contact with,\n\
            yet which is so rarefied we cannot perceive; the Sanctifying Intelligence.",
            "The planet Saturn",
            "Devine Understanding, cognition of which mankind cannot perceive.",
            "the Summit of Sorrow, perceived as a universal experience.",
            "The individualized divine comprehending faculty cithin man, or the spiritual understanding of the Neshamah-- \n\
            one of the higer, spiritualized forces within the human soul; stability. On the more mundane level, owing to its \n\
            planetary attribution of Saturn, issues relating to financial debt; the repayment of these debts; the acquisition of \n\
            real estate; death; crops and agriculture; lassitude; inertia; lack of individual will; activities that require \n\
            intentive thought followed by period of consistent action; influence that is good for legal maters in which justice\n\
            is sought, and which involves the authorities: such as government offices, both state and federal, as well as police, \n\
            judge, courts; also a good influence for bringing issues to the attention of those who have the power to decide an \n\
            outcome favorable to the petitioner; excellent for literary work requiring deep insight; a positive period for \n\
            attempting sales and the advancement of products through advertising by means of printed media; beginning or advancing \n\
            any scientific pursuit; excellent influence under which to engage in deep thought regarding any issue. This Saturanean \n\
            influence however, is extremely adverse for seeking favors or recognition from those who can grant them. It is also \n\
            adverse for: making investments, whether in the stock market or in any kind of business; beginning agricultural \n\
            projects such as planting or seeding. It is also a very ill time for making new acquaintances, and is extremely \n\
            adverse for beginning a marriage, the use of any medical remedy for body or mind, or attempting any cures of body \n\
            or mind by any metaphysical system. Additionally, it is very adverse for surgery of any kind, and a very unfortunate \n\
            hourly influence under which to enter into contract of any kind.",
            "Black",
            "In the World of Atziluth, a brooding crimson red. In Briah, a flat, all engulfing black. In Yetzirah, a dark,\n\
             flat brown. In Assiah, a flat, cool gray, flecked with pink.",
            "Water",
            "Binah is negative, feminine and passive, the essential feminine power of the Tree, just as Chokmah embodies \n\
            the principle masculine power. Binah is situated at the summit of the Pillar of Severity on the glyph.",
            "The Four Queens of the Lesser Arcana, being one from each of the Four Suits.",
            "From Binah onward, the Sensible attributions of each Sephirah take on mundane qualities, in addition to their more aesthetic,\n\
            aesthetic, humanly comprehensible characteristics. This is due to the nature of the planatery concepts themselves, \n\
            of which the physical planets of the same name are simply projections in our physical universe.\n\
\n\
            On the subtle planes of existence, Binah is feminine, passive, and negative in polarity. Below these planes-- \n\
            the world of form-- she is positive, dynamic and active. Why? Because 'she' is actually projected from Chokmah, \n\
            and as such, represents 'his' masculine, positive, dynamix nature below the subtle planes-- that is, in the world \n\
            of form. It is through her dynamic aspect that the positive polarity of Chokmah is projected into the world of \n\
            form, while the two together-- both Chokmah and Binah-- maintain equilibrium throughout the subtle planes and \n\
            the planes of form. But Binah does not act simply as a mirror, projecting Chokmah's positive force below the Supernal \n\
            Triad. In her feminine, passive nature, she provide equilibrium within the Chokmah-Binah dualism if the Supernal \n\
            Triad in the world of Briah. Below this Triad, she projects the Chokmah, the positive principle in order to maintain \n\
            equilibrium in the world of the other seven Sephiroth. As one cannot exist without the other, neither can one one \n\
            understand either of these two Sephiroth without considering its counterpart."];
        
        sephiroh[3] = ["Chesed",
            4,
            "Mercy",
            "Love; Majesty; Gebulah. According to the Sepher Yetzirah, also the 'Receptacular Intelligence'. Also the \n\
            Cohesive or Receptive Intelligence.",
            "the planet Jupiter",
            "The Perfect Mercy and Love of God.",
            "The Vision of Love; the Experience of Supreme Mercy or Compassion stemming from that Vision of Love.",
            "human love as a devotional force as it is applied to another person, an action, or objective; dedication \n\
            stemming from love. On the mundane level, issues relating to or involving abundance; plenty; money; all aspects and types of growth and\n\
            expansion; visions; dreams; spirituality as a way of life. This Jupiteranean influence is very good for beginning a new venture, a nex plan,\n\
            or a new idea of any kind, for working out the details of new plans and ideas, and fir making contracts or agreements, regardless of their \n\
            nature. It is a excellent influence under which to study and gain new knowledge,as it is for involving oneself in educational matters of any kind. \n\
            It is a very fortunate influence under which to marry, and is a very beneficient period for making new acquaintances, borrowing money,\n\
            and dealing with powerful or prominent people who can be of genuine benefit to your plans, ideas, and desires. It is likewise an excellent \n\
            influence for purchasing or selling real estate, asking for favors from virtually anyone directly, and fir indulging in all forms of \n\
            speculation for profit. This influence also has a spontaneous, instinctive, and involuntary characteristic that must be guarded against, \n\
            lest the individual becomes careless in weighing and analysing situations. Yet even so, the outcome of most activities that take place under \n\
            this Jupiteranean power are benefic and positive.",
            "Blue",
            "In Atziluth, a deep violet. In Briah, blue. In Yetzirah, a deep purple. In Assiah, a deep azure flecked with yellow.",
            "Water",
            "As Chokmah is positive in Briah, on the subtle planes, Chesed -- also on the Pillar of Mercy -- is positive, masculine, and dynamic on \n\
            the less subtle or less rarefied planes below the Kether-Chokmah-Binah Supernal Triad. Yet, due to the equilibrium it brings to the Tree, it \n\
            possesses feminine characteristics on the less subtle and material planes of existence, as exemplified by the Water correspondence of its \n\
            Elemental Attribution.",
            "The Four Fours from the Lesser Arcana.",
            "Again, notice how the dynamic, positive masculine nature of Chesed is attribued to this Sephirah, despite the negative, passive, feminine \n\
            characteristic of the element Water assigned to it. By doing so, the Kabbalists worked out the dual aspects of Divine manisfestation \n\
            below Kether: both polarities are needed for existence and expression througout Creation, through the attainment and maintenance of \n\
            equilibrium."];
            
            sephiroh[4] = ["Geburah",
            5,
            "Severity",
            "Strength; Power; Force. According to the Sepher Yetzirah, Geburah is called 'The Radical Intelligence'.",
            "the planet Mars.",
            "Divine Power beyong mortal comprehension.",
            "the Summit of Power, perceived as a universal experience.",
            "Determination; perseverance; vigor; agression; construction or destruction according to purpose; vitality; endurance. This martial \n\
            planetary influence is excellent for dealing with material pursuits and matters requiring physical -- as opposed to mental -- energy; \n\
            it is also a fortuitous time for dealing with sensual affairs of every type, problem of a mechanical nature, or working out the intellectual \n\
            details of new ideas that will lead to new, mechanical inventions. Athletes, bodybuilders, and weightlifters will find this an excellent \n\
            period in which to develop and shape their physical form, while effectively and safety exerting the maximum amount of energy in that physical \n\
            development. The influence also provides for experimental scientific activities as opposed to purely theoretical investigations. It exerts \n\
            a very adverse effect in asking for favors, or for dealing with any beneficent matters of a personal nature whatsoever. It is also a very \n\
            adverse influence under which the intention of seek or make new acquaintances with the intention of seeking favors from them at the time, \n\
            or at some point in the furure. It is also a very unfortunate time in which to deal with any and all legal matters, including those involving \n\
            judges, courts, or attorneys in any way, as well as for gambling, speculation of any type, entering into marriage, or having surgery -- \n\
            whether outpatient or that requiring even the briefest period of hospitalization. The emotions are extremely volatile under this influence, \n\
            particularly those of an aggressive, hostile, or violent nature. It is a time best spend alone, dealing exclusively with matters that the \n\
            influence favors.",
            "Red",
            "In Atziluth, orange. In Briah, red. In Yetzirah, a bright, scarlet red. In Assiah, red, flecked with black.",
            "Fire",
            "Negative; feminine, passive",
            "the Four Fives of the Lesser Arcana of the deck",
            "Once more, notice that Geburah is on the left hand column of the Tree, and has a feminine nature, as do all the Sephiroth in that column \n\
            which is headed by Binah. Yet, her attributes are decidedly male, masculine, dynamic, positive, and active, for the reason previously \n\
            discussed. As such, the equilibrium of the Tree is maintained. This dynamic, masculine nature is expressed through the elemental attribution \n\
            of this Sephirah, namely Fire."];       

            
            sephiroh[5] = ["Tiphareth",
            6,
            "Beauty",
            "the Mediating Intelligence;the Microprosopus or the Lesser Countenance; the Son; the Man; the Son of Ma, referring to the Christ-Consciousness.",
            "the Sun",
            "Perfect Beauty; Perfect Harmony; the Ideal; the sum total of all that is Good.",
            "the Vision of the Harmony of all things, and through this Vision, the apprehension of or direct experience of the essence of Beauty itself.",
            "the imaginative faculty of the individual; the realm of the HGA, the Holy Guardian Angel in magical literature; the point of arrival of \n\
            the Abramelin Operation: an intensive, six-month magical working for attaining the K&C -- Knowledge and Conversation of the Holy Guardian \n\
            Angel. In the more mundane sense, owing to its Astrological Attribution, the Sun, the attributions include: power and success in life; \n\
            Life itself; illumination; mental power and ability; as with Jupiter under Chesed, also money; robust physical, emotional, and mental health;\n\
            growth at the personality, character, and psychic levels; dealing with superiors of all kinds, and in any situation; asking for favors from \n\
            others in any proposal whatsoever, be it of a business or personal nature; composing important letters that produce in the mind of the \n\
            intended recipient a picture of the writer as a confident, balanced individual whose request for aid, introductions, or favors should be \n\
            immediately granted. This is also an excellent influence under which one can act in noble and high-minded ways that will build up his or her \n\
            public esteem and prestige. This influence however is adverse for involving oneself in illegal plans, actions, or activities of any kind \n\
            whatsoever. Curiously, it also provides a negative influence for beginning or launching a new business, a new plan, or new idea, owing to \n\
            its underlying Elemental Attribution which is always shifting, changing in force and form, as the Sun itself, the most Sensible of the Sephirothal \n\\n\
            influence that has further descended into the realm of matter. By the same rationale, it is likewise adverse for signing contracts of any \n\
            kind, and for entering into any partenerships, mutually beneficial arrangements or agreement -- whether of a social, business, professional, \n\
            or personal nature -- or for entering into any kind of relationship in which there is a political element of any kind. Additionally, this \n\
            planetary influence is also quite adverse for marriage, for making any new investments of any kind, for purchasing or liquidating real estate \n\
            holdings, and for all form of surgery.",
            "Bright yellow",
            "In the world of Atziluth, a clear, rose pink. In Briah, a golden yellow. In Yetzirah, a rich, salmon pink. In Assiah, a golden amber.",
            "Air",
            "None, as Tiphareth is the product of the positive, masculine polarity of Chesed, and the negative feminine polarity of Geburah, acting \n\
            in equilibrium and unison to project this central point of the Tree.",
            "the Four Sixes of the Lesser Arcana of the deck.",
            ""];       
        
            sephiroh[6] = ["Netzach",
            7,
            "Victory",
            "the Sepher Yetzirah gives the Sephirah the title of 'The Occult Intelligence'. Also, Eternity; Triumph; Firmness. ",
            "the planet Venus",
            "the Vision of Beauty Triumphant.",
            "the Experience of Beauty Triumphant",
            "Unselfishness; Love, but of a sexual nature; beauty of form, and the appreciation of that beauty; the emotions of \n\
            the conscious level of our being; women; music; selg-indulgence; extravagance. Also on the mundane level, this influence governs \n\
            all material and sensual affaires; music; arts; the theater; any form of behavior or expression that supports sensuality. \n\
            It is also a very fortunitious influence under which to begin any new enterprise or project, whether sensual or business in nature. \n\
            It is also an excellent influence in which to make new acquaintances, but only those that are met through spontaneous social contact. \n\
            It is also a very favorable incluence for entering into marriage, to borrow or loan money, and to host social gatherings and parties, \n\
            but onlu those affairs that are meant for pure enjoyment. It is very positive for speculating in stocks, bonds, or in any new business \n\
            proposition. It is important to note here that due to the Venusian planetary influence of this Sephirah, almost any activity or action \n\
            that is begun or ended while this influence is in operation, will bear very significant, desirable, or fortunate results. \n\
            It is an influence that, in effect, blesses and magnifies activities of almost any kind, but epecially those of a sensual and material nature. \n\
            There are a few very adverse aspect of this influence, such as dealing with social underlings or subordinates; beginning longs trips \n\
            to remote locations; using social means to harm enemies or competitors, or to attempt using social functions as a means of gaining a \n\
            business or personal advantage at the expense of a collaborator or fellow worker.",
            "green",
            "In Atziluth, amber. In Briah, emerald. In Yetzirah, bright yellow-green. In Assuah, olive, flecked with gold.",
            "Fire",
            "Masculine, positive",
            "the Four Sevens of the Lesser Arcana of the deck",
            ""];
        
        
            sephiroh[7] = ["Hod",
            8,
            "Splendor",
            "Glory; the Yetziratic text calls Hod the 'Absolute or Perfect Intelligence'",
            "the planet Mercury",
            "the Vision of Splendor",
            "once again, according to the Yetziratic Text, Hod is called the Perfect Intellifence because it is power in a state of equilibrium. \n\
            For the individual to experience this state is to attain the peak experience of this Sephirah.",
            "On the higher levels, Truthfulness and Honesty are two of the blessings of this Sephirah, along with the philosophic \n\
            and laboratory pursuit of Alchemy. On the more mundane levels, this Mercurial influence is very positve for dealing with \n\
            intellectual discernments, scientific thought; mathematics; writing of all kinds; logic; reaon; using and accelerating \n\
            the analytical faculty of the conscious self; thinking; speaking, whether in public or private. Additionally, as with Netzach \n\
            and Venus, the Mercurial influence of Hod is very beneficial for art, music, and and the theater; for literary work of any kind; \n\
            to design or begin new advertising efforts; to plan new projects or involvements; to launch new business plans; \n\
            to make new acquaintances in business or academic circles, and to begin new business relationships. It is a excellent influence \n\
            under which one can successfully initiate contracts, but short-term ones only. It is also an excellent time for reading or buying new books \n\
            that can be of great help to the individual in an intellectual life-sustaining, or life-enhancing way; also for dealing with business \n\
            or academic journal, papers, or researching documents, such as land and property Title and Deed searches. This influence also facors \n\
            educational matters of every type, as well as the buying and selling of printed material. It imparts a very benefic influence \n\
            for taking any medicine or beginning any system of mental cure. It is an excellent influence for mystical, metaphysical, or \n\
            magical study, under which profound insight into occult, esoteric, mystical, or magical concepts can be achieved, the esence of \n\
            which can be then used for intellectual growth, the attainment of considerable material benefit or both. It is also a positve  influence \n\
            for speculating and taking chances in a business or proposition that at other times may appear unsound or chancy. \n\
            This is also an excellent influence under which important letters can be written. This Mercurial influence has some serious negative aspects \n\
            as well, such as dealing with ennemies in any legal manner; entering into marriage, or seeking favors from people in authoriry. \n\
            It is equally adverse for either purchasing or selling real estate holdings, and is a period in which the individual can become \n\
            the target of fraudulent or even illegal schemes. In general, it is an influence under which the truthfulness of all statements coming \n\
            from anyone must be carefully evalueted, despite the overall positive aspects this influence exerts. ",
            "orange",
            "In Atziluth, a violet-purple. In Briah, orange. In Yetzirah, a russet-red. In Assiah, a yellowish-black or brown flecked whith white.",
            "Water (feminine, creative, passive, negative)",
            "Negative(feminine)",
            "The Four Eights of the Lesser Arcana of the deck",
            ""];   
        
        
//            sephiroh[2] = ["Chesed",
//            3,
//            "Wisdom",
//            "",
//            "",
//            "",
//            "",
//            "",
//            "",
//            "",
//            "",
//            "",
//            "",
//            ""];       
        //sephiroh[1] = ["Chokmah",2,"Sagesse"];
        //sephiroh[2] = ["Binah",3,"Compréhension"];
        //sephiroh[3] = ["Chesed",4,"Compassion"];
        ///sephiroh[4] = ["Geburah",5,"Sévérité"];
        
        //Here just put the data hardcoded..
        var name,number,primary_title,other_titles,intelligible_qualities,
                human_experience,sensible_qualities,color_tree, color_scale,
                elemental_attribution,polarity,tarot_card,commentary;
        
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<sephiroh.length;i++){
                name = sephiroh[i][0];
                number = sephiroh[i][1];
                primary_title = sephiroh[i][2];
                other_titles = sephiroh[i][3];
                intelligible_qualities = sephiroh[i][4];
                human_experience = sephiroh[i][5];
                sensible_qualities = sephiroh[i][6];
                color_tree = sephiroh[i][7];
                color_scale = sephiroh[i][8];
                elemental_attribution = sephiroh[i][9];
                polarity = sephiroh[i][10];
                tarot_card = sephiroh[i][11];
                commentary = sephiroh[i][12];
                
                var sql = "INSERT INTO sephirah (name, number,primary_title,other_titles,"+
                        "intelligible_qualities,human_experience,sensible_qualities,"+
                        "color_tree,color_scale,elemental_attribution,polarity,tarot_card,commentary"+
                        ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
                transaction.executeSql (sql, [name,number,primary_title,
                                                other_titles,intelligible_qualities,
                                                human_experience,sensible_qualities,color_tree,
                                                color_scale,elemental_attribution,polarity,tarot_card,commentary],ok, error);
            }                    
        });


        //Fill the paths
        var path = new Array();
        path[0] = [11,
                    1,
                    2,
                    "Aleph(A), meaning, the head of an Ox.",
                    1,
                    "The Scintillating Intelligence",
                    "the primeval movement of the Great, Creative Breath, spinning the chaos from the moment of Creation \n\
                    into a creative core.",
                    "the Element, Air",
                    "Tarot Trump, Zero (O)-- The Fool"
                ];
                
        path[1] = [12,
                    1,
                    3,
                    "Beth (B), meaning, House.",
                    2,
                    "The Transparent Intelligence",
                    "the combined natures of the Sephiroth Chokmah and Hod are reflected by this Path. \n\
                    Their properties are Mercurial, here, in an alchemical sense of Universal Mercury, \n\
                    as hinted at in the section Hod. That is, due to the higher octave of this Path, \n\
                    the Mercurial nature expressed herer is more in line with the Intelligible Quality found \n\
                    in  the Mercury of the Philosophers, which can be reached through the higher aspects of \n\
                    the Sensible Qualities of Hod; Initiated working in the realms of Philosophic and Laboratory \n\
                    Alchemy. This Mercurial Principe is therefore that living ever-changing Principe of cohesive \n\
                    force that holds all of Creation together, from the subtlest of matter to its most material form.",
                    "the planet, Mercury, nut with the understanding given above.",
                    "Tarot Trump, One(I) --- The Magician."
                ];

//        path[1] = [11,
//                    1,
//                    2,
//                    "",
//                    1,
//                    "",
//                    "",
//                    "",
//                    ""
//                ];

       var number,sephirah_1,sephirah_2,name,alphabet_position,
                symbolic_meaning,occult_concept,attribute, tarot_attribution;
        
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<path.length;i++){
                number = path[i][0];
                sephirah_1 = path[i][1];
                sephirah_2 = path[i][2];
                name = path[i][3];
                alphabet_position = path[i][4];
                symbolic_meaning = path[i][5];
                occult_concept = path[i][6];
                attribute = path[i][7];
                tarot_attribution = path[i][8];

                
                var sql = "INSERT INTO path (number, sephirah_1,sephirah_2,name,"+
                        "alphabet_position,symbolic_meaning,occult_concept,"+
                        "attribute,tarot_attribution"+
                        ") VALUES (?,?,?,?,?,?,?,?,?)";
                transaction.executeSql (sql, [number,sephirah_1, sephirah_2,
                                                name,alphabet_position,symbolic_meaning,
                                                occult_concept,attribute,tarot_attribution],ok, error);
            }                    
        });



        //Fill the week
        var week = new Array();
        week[0] = ["Sunday",
             "Sun",
             "Tiphareth"
         ];
         
        week[1] = [
                    "Monday",
                    "Moon",
                    "Yesod"
                ];
        week[2] = ["Tuesday",
                    "Mars",
                    "Geburah"
                ];
        week[3] = ["Wednesday",
                    "Mercury",
                    "Hod"
                ];
        week[4] = ["Thursday",
                    "Jupiter",
                    "Chesed"
                ];
        week[5] = ["Friday",
                    "Venus",
                    "Netzach"
                ];
        week[6] = ["Saturday",
                    "Saturn",
                    "Binah"
                ];
 
                

       var name,planet,sephirah;
        
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<week.length;i++){
                name = week[i][0];
                planet = week[i][1];
                sephirah = week[i][2];
                
                var sql = "INSERT INTO weekdays (name, planet,sephirah"+
                        ") VALUES (?,?,?)";
                transaction.executeSql (sql, [name,planet, sephirah],ok, error);
            }                    
        });

        //Set the data status
        this.db.transaction (function (transaction) 
        {
            var sql = "INSERT INTO status (property, value) VALUES (?, ?)";
            transaction.executeSql (sql, ["synchronized", "true"],ok, error);
        });

    };
    
    
     DBService.prototype.syncEphemerisDB = function (){
       
        var ephemeris = new Array();
        ephemeris[0] = ["24/04/2014",
                    "06:40",
                    "20:35"
                ];
        ephemeris[1] = ["25/04/2014",
                    "06:28",
                    "20:54"
                ];
        ephemeris[2] = ["26/04/2014",
                    "06:26",
                    "20:55"
                ];
                
         var date,sunrise,sunset;
        
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<ephemeris.length;i++){
                date = ephemeris[i][0];
                sunrise = ephemeris[i][1];
                sunset = ephemeris[i][2];
                
                var sql = "INSERT INTO ephemeris (date, sunrise,sunset"+
                        ") VALUES (?,?,?)";
                transaction.executeSql (sql, [date,sunrise, sunset],ok, error);
            }                    
        });
     };
    
    DBService.prototype.initialize = function(){
        var current = this;
        
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT value FROM status WHERE property=?";
            transaction.executeSql (sql, ["synchronized"],
            function(transaction, result){
                if (result.rows.length){
                    if(result.rows.item(0).value=="true"){
                        return;
                    }
                }else {                        
                     current.fillDB();
                }
            }
            , error);
        });
    };

    DBService.prototype.updateShephirahOfTheDay = function (day){
        $('#dayRuler').html("");
        
        var day;
        var sephirah;
        
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT * FROM weekdays WHERE id=?";

            transaction.executeSql (sql, [day],
            function(transaction, result){
                if (result.rows.length){
                    day = result.rows.item(0);
                    
                    console.log(day);
                    sql = "SELECT * FROM sephirah WHERE name=?";
                    transaction.executeSql (sql, [day.sephirah],
                    function(transaction, result){
                        if (result.rows.length){
                            sephirah = result.rows.item(0);
                            console.log(sephirah);
                            $('#dayRuler').html(sephirah.name + '('+day.planet+')');
                        }
                    }, error);
                }
            }, error);
        });
        return;
    };
    
    
//}());
