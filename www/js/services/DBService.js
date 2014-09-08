/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
(function () { 'use strict';
    
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
        this.dbLoadStatus = 0;
        if(reset){
            this.dropTable("status");
            this.dropTable("influences");
            this.dropTable("sephirah");
            this.dropTable("path");
            this.dropTable("tarots");
            this.dropTable("weekdays");
        }
            
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='status'";
            transaction.executeSql(sql, undefined,
            function(transaction, result){
                if(result.rows.length===0){                      
                    var sql = "CREATE TABLE IF NOT EXISTS status " +
                          " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                          "property VARCHAR(100) NOT NULL, " + 
                          "value VARCHAR(100) NOT NULL)";
                      transaction.executeSql (sql, undefined, ok, error);
                }
            }
            , error);
        });

        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='sephirah'";
            transaction.executeSql(sql, undefined,
            function(transaction, result){
                if(result.rows.length===0){                      
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
                }
            }
            , error);
        });
        
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='path'";
            transaction.executeSql(sql, undefined,
            function(transaction, result){
                if(result.rows.length===0){                      
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
                }
            }
            , error);
        });

        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='tarots'";
            transaction.executeSql(sql, undefined,
            function(transaction, result){
                if(result.rows.length===0){                      
                    var sql = "CREATE TABLE IF NOT EXISTS tarots " +
                    " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                    "name VARCHAR(100) NOT NULL, " +
                    "path INTEGER NOT NULL, " + 
                    "sensible_meaning_upward TEXT," + 
                    "sensible_meaning_reversed TEXT,"+
                    "commentary TEXT)";
                    transaction.executeSql (sql, undefined, ok, error);
                }
            }
            , error);
        });

       this.db.transaction (function (transaction) 
        {
            var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='weekdays'";
            transaction.executeSql(sql, undefined,
            function(transaction, result){
                if(result.rows.length===0){                      
                    var sql = "CREATE TABLE IF NOT EXISTS weekdays " +
                    " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                    "name VARCHAR(100) NOT NULL, " + 
                    "planet VARCHAR(100) NOT NULL, " + 
                    "sephirah VARCHAR(100) NOT NULL)";
                    transaction.executeSql (sql, undefined, ok, error);
                }
            }
            , error);
        });
        
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='influences'";
            transaction.executeSql(sql, undefined,
            function(transaction, result){
                if(result.rows.length===0){                      
                    var sql = "CREATE TABLE IF NOT EXISTS influences " +
                    " (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, " +
                    "daySephiroth INTEGER NOT NULL, " + 
                    "hourSephiroth INTEGER NOT NULL, " +
                    "polarity VARCHAR(100) NOT NULL," +
                    "description TEXT NOT NULL, " + 
                    "path INTEGER, " + 
                    "tarot INTEGER, " + 
                    "FOREIGN KEY(daySephiroth) REFERENCES sephirah(id), "+ 
                    "FOREIGN KEY(hourSephiroth) REFERENCES sephirah(id))";
                    transaction.executeSql (sql, undefined, ok, error);
                }
            }
            , error);
        });
        
        
        if(reset){        
            this.fillDB();            
        }
    };
    
    DBService.prototype.dropTable = function(name){
        if(name!==undefined){
            this.db.transaction (function (transaction) 
            {
                var sql = "SELECT name FROM sqlite_master WHERE type='table' AND name='"+name+"'";
                transaction.executeSql(sql, undefined,
                function(transaction, result){
                    if(result.rows.length>0){
                        var sql = "DROP TABLE "+name;
                        transaction.executeSql (sql, undefined, ok, error);
                    }
                }
                , error);
            });
        }
    }


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
        
            sephiroh[8] = ["Yesod",
            9,
            "the Foundation",
            "the Anima Mundi, or the Soul of the World; also the 'Pure Intelligence or Clear Intelligence",
            "the Moon (Luna)",
            "the Divine Cognition of working of the universe",
            "the Vision or Experience of the working of the universe",
            "according to the Yetziratic Text, Yesod purifies the emanations received from the other Sephiroth, as it is the receptable of all of \n\
            the emanations from the other eight spheres above it. Additionally, since Yesod is the sole focusof the other Sephiroth emanations, \n\
            it is the sole projector of those forces into the world of matter: the physical plane of Malkuth. It is also the Astral Plane of \n\
            occultism, and the realm of the Astral Light. It is the sphere of Magic as well, as all operations of a magical nature that intended \n\
            to produce an effect in Malkuth, have their foundations in this Sephirah. On the daily, more pragmatic level, the planetary attribution \n\
            of yesod, the Moon, takes the correspondences of, and produces its influence upon: women; the personality; modifications; rapid changes ;\n\
            fluid conditions, ever cycling between extremes. As with Hod's projection, Mercury, educational efforts of all kinds are also ruled by \n\
            the Moon, it being the projection of Yesod into our universe. Additionally, this lunar influence provides a positive impulse for the planting \n\
            of seeds, beginning journeys by water, or making new aquaintances in a social, business, or academic setting. It is also an excellent \n\
            influence for all literary work, for entering into the sacrament of marriage, for taking any medecine, or to begin any mystical or metaphysical \n\
            system of body or mind treatment in which a direct, complete cure is sought. This Lunar influence of Yesod is also very positive for surgery of \n\
            all types, and for dealing with metaphysical, mystical and magical studies. This fluid, creative, Lunar influence provides an energy dynamic backdrop \n\
            against which most activities and aspirations indulged in during the time of its reign will prove both prolific and productive.",
            "purple",
            "In Atziluth, indigo. In Briah, violet. In Yetzirah, a very dark purple. In Assiah, a citrine flecked with azure.",
            "As with Tiphareth, the elemental attribution of Yesod is Air, owing to its position on the Middle Pillar of the Tree.",
            "Neutral",
            "the Four Nines of the Lesser Arcana of the deck",
            "Notice, that as with Yesod and the other Sephirah on the Middle Pillar, Kether also takes the elemental attribution of Air as well. \n\
            This is thought to be due to the impulsive, ever-changing, fluid, potential-to-kinetic and back again dynamics of the Air element, \n\
            but in its most pure, rarefied, and complete form in the case of Kether. In Yesod however, these transitional properties of the Air \n\
            Element can be seen as being reflected directly into Malkuth, where they become more stable by virtue of their appearance in the densest, \n\
            most material form of matter -- the physical matter which is found in Malkuth. "];  
                    
            sephiroh[9] = ["Malkuth",
            10,
            "the Kingdom",
            "the World of the Four Elements -- Air, Earth, Water, and Fire; the 'Resplendent Intelligence', because as Fortune has reflected, \n\
            it is exalted above every head and sits upon the Throne of Binah. Also, The Gate of Justice; the Gate of the Daughter of the Mighty One; \n\
            the Gate of Prayer; the Gate of the Shadow of Death and od Death itself; the Gate of the Garden of Eden; the Queen; the Bride; the Inferior Mother.",
            "the Element, Earth, but divided into four quadrants, representing the World of the Four Elements: Air, Earth, Water, and Fire. \n\
            That is, matter in its entirety, yet not simply the gross form that composes matter as we perceive it with our five senses. The orher \n\
            subtle psychic qualities of the Four Elements are also included in this attribution, namely, the subtle, psychic aspects of Air, Earth, \n\
            Water, and Fire. These too are encompassed by Malkuth.",
            "the Existence and Projection of the Psychic and Mundane Essences of Four Elements into the realm of Malkuth.",
            "the Vision of the Holy Guardian Angel.",
            "discernement; astuteness; acute sensory perception of ordinary matter. The physical performance of Abramelin Operation, leading to the \n\
            Vision of the HGA, and the Attainment of the Knowledge and Conversation of the HGA while the individual is yet in human form.",
            "the tenth Sephirah is divided by an 'X' into four equal sections in order to bisect the sphere. The colors oliven, russet, citrine, and black \n\
            are then assigned, one color to each of the four equal sections.",
            "In the Atziluthic World, a clear yellow. In Briatic World, olive, russet, citrine, and black. In the Yetziratic World, olive, russet, \n\
            citrine, and black, flecked with gold. In the Assiatic World, black, rayed with yellow.",
            "Earth (as described above)",
            "Neutral. The grounding-point of the purified emanations from all of the other Sephiroth, radiating from Yesod into Malkuth.",
            "the Four Tens of the Lesser Arcana of the deck.",
            "There is a difficult point here regarding the mystical relationship between Tiphareth and Malkuth of the Middle Pillar, which some readers \n\
            may need to understand clearly for their Kabbalistic studies and beyond. Specifically, it involves the concept of the 'True Will', the \n\
            HGA, and the Attainment of the Knowledge and Conversation (K&C) of the HGA through the magical working of the Abramelin Operation.\n\
            The True Will of the individual; that is, the Will of God for the individual, is identified with the Chiah. In turn, the Chiah is the \n\
            essential energy of that part of the self which is eternal. But the realm of the HGA who delivers the True Will to the individual, is that \n\
            of Tiphareth. Here, the HGA is considered by some to be the Higher Self: a type of pure consciousness so exalted as to be above the everyday \n\
            reach of the individual. Fortune said of it, '...it is an intensification of awareness...' and from it '...comes a peculiar power of insight \n\
            and penetration which is of the nature of hyper-developed intuition.'. \n\
            Thus, in some occult circles and magical societies, it is conceived of as the elevation of the individual's highest qualities, raised to the nth level, \n\
            yet partaking of divine qualities by its very definition. While the Experience of the HGA most certainly does exhibit this divine state that \n\
            does lie beyoung ecstasy -- which quickly transforms into an Experience of Divine Love and Beauty beyoung description -- it is my opinion that \n\
            Fortune's viewpoint is far, far, from the sum total of the experience of Attaining the Knowledge and Conversation of the HGA. \n\
            In point of fact, the HGA is an individual being with its own universe, holding an utterly profound and nebulous personal consciousness of its own, \n\
            yet with a conscious awareness of the individual human being over which it presides. Hence, it is through the Abramelin Operation, conducted \n\
            physically in Malkuth according to the Abramelin text, that the individual does attain to the actual, physical Vision of the HGA, which is \n\
            then immediately followed by the Attainment to the full K&C of this being. \n\
            In other words, both Fortune's view of the HGA's nature and the individual's experience of it as I have laid down herein, are valid in my opinion. \n\
            That is, through the classical performance of the Abramelin Operation, the individual calls down the True Will from Chockmah into Malkuth, as that True \n\
            Will has manifested in the centralized focus of Tiphareth, and through the being of the HGA. Through the intervention of the Holy Guardian Angel in \n\
            Tiphareth. \n\
            At the same time, Manhood, existing in Malkuth, is elevated into Godhead, through the agencu of the HGA, in Tiphareth. And so the ancient admonition, \n\
            'Bring Godhead down into manhood, and elevate manhood in Godhead,' is fulfilled. It is a fundamental error to think however, as Dion Fortune herselt \n\
            so unfortunately states later on in her classic book on Kabbalah, that HGA '... consists neither in voices nor visions, but is pure consciousness...'. \n\
            Why is this error so dangerous? Because the state of the individual's subjective synthesis is effected thereby, precluding the actual Vision of the HGA. \n\
            This occurs through the very acceptance of her point of view: an attitude engendered, projected, and maintained by mainstream New Age Magick. \n\
            As a result of accepting this limiting viewpoint, the individual can only attain to a partial experience of the HGA; a partial result  that ends more \n\
            often than not in hallucinations regarding the experience, and confusion as to the individual's full True Will. \n\
            In more applicable terms, this error in understanding can cause difficulties in the diligent individual's formation of his or her \n\
            subjective state; one that can produce subconscious errors in the use of the Kabbalistic Cyles System. \n\
            There is no need for an either-or scenario as so many magical schools, occult circles, want-to-bees, self-professed magicians, and occultists \n\
            insist, all as a result of never having attempted the Abramelin Operation, let alone having Attained to the full K&C of the HGA, and this by \n\
            attaining to the Vision of this being in Malkuth, that this simple understanding can become known. "];       
        
        
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
        path.push([11,
                    1,
                    2,
                    "Aleph(A), meaning, the head of an Ox.",
                    1,
                    "The Scintillating Intelligence",
                    "the primeval movement of the Great, Creative Breath, spinning the chaos from the moment of Creation \n\
                    into a creative core.",
                    "the Element, Air",
                    "Tarot Trump, Zero (O)-- The Fool"
                ]);
                
        path.push([12,
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
                ]);



        path.push([17,
                    3,
                    6,
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
                ]);

        path.push([18,
                    3,
                    5,
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
                ]);



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
        
        var tarots = new Array();
        tarots.push(["The Lovers (VI)",   
                    17,
                    "A trial in life or an experiment of a personal nature that you will successfully conclude; the emergence of \n\
                    a new affection or object of devotion, whether it be a person or a new interest of some type.",
                    "A failed life-trial or experiment; the loss of affection for a person or interest",
                    ""]);
        tarots.push(["The Chariot (VII)",   
            18,
            "Victory, conquest, overcoming odds and obstructions, but only after battle.",
            "Defeat after battle; obstructions to plans and actions; plans and actions defeated by either internal or external \n\
            obstructions and obstacles, but once again, only after battle.",
            "This card, and card XVI -- The tower, Path 27, Peh -- are the most difficult cards of the Greater Arcana. \n\
            With either card, the plans made, the opportunities that arise, and the actions taken under their influence, \n\
            have an extremely grim, major component to them. Of the two cards however, this card (VII) The Chariot, is \n\
            perhaps surprisingly the hardest of the two to work with, even in its upright position, for it bespeaks \n\
            of a long, arduous struggle which will take a heavt toll on the individual, even though he or she will become \n\
            victorious (when it is in the upright position)."]);
        
//        tarots[0] = [   
//            0,
//            "",
//            "",
//            ""];
                    "name VARCHAR(100) NOT NULL, " +
                    "path INTEGER NOT NULL, " + 
                    "sensible_meaning_upward TEXT," + 
                    "sensible_meaning_reversed TEXT,"+
                    "commentary TEXT)";
        //fill the influences
        var name,path,sensible_meaning_upward,sensible_meaning_reversed,commentary;             
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<influences.length;i++){
                name = tarots[i][0];
                path = tarots[i][1];
                sensible_meaning_upward = tarots[i][2];
                sensible_meaning_reversed = tarots[i][3];
                commentary = tarots[i][4];
                
                var sql = "INSERT INTO tarots (name, path,sensible_meaning_upward, sensible_meaning_reversed,commentary "+
                        ") VALUES (?,?,?,?,?)";
                transaction.executeSql (sql, [name,path,sensible_meaning_upward, sensible_meaning_reversed ,commentary],ok, error);
            }                    
        });


        //Fill the paths
        var influences = new Array();

        //Sun Day
        influences.push([   
                    6,
                    3,
                    "Positive",
                    "<b>Exemple of Use 1</b>: You are looking to make a real estate investment. Someone approaches you out of the blue, \n\
                    on -- curiously enough -- a Sunday, during a Saturn Hour with what sounds like a ideal offer. Should you take it? \n\
                    Yes! The downward flow of the heavy-handed but stabilizing influence of Saturn will blend with the growth desires \n\
                    stimulated by the Sun, to make this a very profitable investment indeed. The Path's influence will powerfully serve \n\
                    to bring about a very sucessful conclusio to the transaction, one you will long remember and grateful for. <br/>\n\
                    <b>Exemple of Use 2:</b>  You make a plan for personal growth. You can use the heavy-handed, stabilizing influence of \n\
                    the Saturn Hour during this new Sunday to not only detail your plans, but to set down the steps necessary to hurl \n\
                    them at the world during the upcoming week. And you will succeed. Take that to the bank!",
                    17,
                    6
        ]);

        influences.push([   
                    6,
                    9,
                    "Negative",
                    "<b>Exemple of Use 1:</b> \n\
                    <b>Exemple of Use 2:</b> .",
                    25,
                    14
        ]);

        //Moon Day
        influences.push([   
                    9,
                    6,
                    "Positive",
                    "<b>Exemple of Use 1:</b> \n\
                    <b>Exemple of Use 2:</b> .",
                    25,
                    14
        ]);

        //Mars Day
        influences.push([   
                    5,
                    3,
                    "Positive",
                    "<b>Exemple of Use 1:</b> it's Tuesday, and things at your place of employment have not been going well. The economy is still \n\
                     spiraling downward, despite the inflated figures and the grinning, lying-through-their-teeth reassurances the anchors of the \n\
                    Nightly Business Report have been feeding you for the past five years. You get to work, and your boss calls you into his office. \n\
                    You notice it's during an hour ruled by Saturn. He asks you to sit down, and then drops the bomb: a cutback is coming, \n\
                    and you will probably be among those who gets a pink slip, with no chance of being called back to the company. There is no \n\
                    employment left in your area, all the companies have been laying people off for the past year. This means a move with money \n\
                    you don't have, to another city where new employment is a crapshoot at best, and immediate bills that cannot be paid. \n\
                    You weekly paycheck was only thing keeping you (and perhaps your family) marginally afloat. You realize all of this words \n\
                    are sounding like hollow echoes in your ears, and you panic. \n\
                    Somehow, through all the terror coursing through your mind and emotions, you recall this Path influence. You know you stand a chance \n\
                    -- but only a chance -- if you can turn it around. You calm your mind and emotions, take a deep breath, and say, 'What if I make \n\
                    myself more valuable to the company? Like, maybe learning two others jobs that are now done by others who will be getting cut? \n\
                    I'm also willing to put in ten more hours a week without pay, if that will help! I'm stretched so thin now, I'd go under for sure \n\
                    if I lose this job!'\n\
                    He looks at you, realizing that the others who will be laid off are in the same situation you're in. But he is not talking to them \n\
                    during this hour. He is talking to you. The Path influence is attenuating the raw, destructive energy of Mars ruling the day, \n\
                    and bolstering the fourfold more powerful Saturn influence of 'this being a good influencee for bringing issues to the attention \n\
                    of those who have the power to decide an outcome favorable to the petitioner.' He looks at you carefully, and says, \n\
                    'OK, I'll tell you what. You start learning those other two jobs today, and be prepared for fifty-hour week. If you show me \n\
                    that you can cut the mustard, I'll try to keep you on.' He continues, stressing the point, 'Understand this: there are no guarantees, \n\
                    but I'll do the best I can to keep you on. Agreed?' At this point, you must agree.\n\
                    You will struggle, and for a long, very unstable, extremely emotional upsetting time. But -- and this is the important point and the \n\
                    influence of this Path -- he will keep you, while all those around you are worrying about their unemployment insurance running out. \n\
                    Further, after the business storm clears, you will be the one that will not only receive a very significant raise in pay, but \n\
                    will be promoted to boot. That is if the company can stay afloat during this period. Now do you see how this Path works, even \n\
                    when its positive influence is in effect? I trust you do, because this is as clear as I can make it.\n\
                    <br/><b>Exemple of Use 2:</b> You have taken a hard loog at your-self in that new full-length mirror you recently purchased, and you \n\
                    definitely did not like what you saw. You still can't believe that your belly actually does arrive at a destination five minutes \n\
                    before you do, with your jowls a close second. And that slight pallor about you looks none too good either. You knew you \n\
                    were out of shape, but still, you have been taking nightly walks. Well, sort of frequent walks,a nd watching your carbohydrates, \n\
                    and eating less. Surely all of that activity and care should have helped to keep the physique in decent shape, but obviously it didn't! \n\
                    You are aware you're getting older and you know the excess weight is not good for your health. It's a Tuesday, and a Saturn Hour \n\
                    is in force. Flow is down the Tree, from the Hour into the Day. You've had enough. The cideo you sent for on that wiz bang home \n\
                    home exercice machine that promises a complete workout in twenty minutes a day, four times a week, is staring you in the face again. \n\
                    Or maybe it's the memory of that new gym that opened up down the block that keeps popping back into mind. So you go for it. You \n\
                    order the machine or sign up for a year's membership during this hour. \n\
                    Since you now plan for important matters using your newly acquired knowledge of Kabbalistic Cycles System, you begin your \n\
                    grim workout regimen under a similar or different set of favorable influences. Guess what? Yes, you will struggle. You will see \n\
                    just how hard keeping to a workout schedule really is, and how determined you have to be in order to recapture something of \n\
                    your human figure. But I have news for you. After this battle, you will be victorious! \n\
                    You will become the new you -- imagined by the aggressive energetic influence of Mars, and the grimly determined impulse \n\
                    of Saturn during your hour of decision. And yes, the Path influence represented by Card VII The Chariot, dit turn out to be \n\
                    correct. It was a struggle to say the least. But you succeeded, and through the overall influences of the Sephiroth and their \n\
                    Path connection, you also learned something more about about yourself, something you didn't anticipate when you took responsibility \n\
                    for your health and appearance. That is, as with all things in this life: it's up to you, and no one else. You've gained \n\
                    immeasurably with you insight into self-motivation, and self-discipline. So the hard fought battle gave you more than you \n\
                    bargained for -- but at a price no one who has not taken to this Path influence could ever understand.",
                    18,
                    7
        ]);

        influences.push([   
                    5,
                    4,
                    "Positive",
                    "<b>Exemple of Use 1:</b> Your are deeply involved in a money making project that if successful, will put you on easy \n\
                    street for the rest of your life, or at least provide the financial freedom you have always wanted. The project has required \n\
                    an enormous amount of your time, physical stick-to-it-ness as well as mental exertion, more nights without sleep than you \n\
                    care to remember, and has drained all of your liquid assets. You are at the end of your rope. You've had enough. No one cares \n\
                    enough about your new project to even look at it, let alone take it and you seriously, and you are about to throw in the \n\
                    towel and chalk the entire matter up to a hard earned lesson in life. \n\
                    It's a Tuesday during an hour ruled by Jupiter, and you receive a phone call from someone who heard of your new invention, \n\
                    product, process, or software, take your pick. He wants you to be at his office or plant the following Monday morning, bright \n\
                    and early, to give him demonstration and full explanation. You know this is the break you've been waiting for,  but \n\
                    you are beyond physical and mental exhaustion. You have to go to your regular job tomorrow, and take care of a hundred other \n\
                    duties this weekend, which you have already put off much to long. To top it all off, this new prospect is in the next state. \n\
                    You are flat broke. You can't even afford an airline ticket, and certainly don't have the time to drive the distance to meet him.\n\
                    Yet you know that this downward flow on the Tree, through the Path of Strength, is marshaling an inner strength you never \n\
                    knew you possessed, and it is propelling you to somehow overcome what you are certain is the last obstacle standing between \n\
                    you and your dreams fulfilled. You realize that the beyond physical strength welling up from some hidden depth within you is indeed \n\
                    that strength through which the Holy warrior battles against overwhelming odds, and victoriously subdues and overcomes a great threat. \n\
                    It is truly rooted in some genuine spiritual power or psychic force within you. \n\
                    Through your own will and determination, and yet by way of something else you sense surging through your nature, you find \n\
                    yourself 'in mode' to fight one. You call in sick at work the next day, throw together a presentation Friday night and \n\
                    Saturday, borrow the money you need for the airline ticket, and find yourself at this prospective client's office at 8:15 AM \n\
                    on Monday morning. Will you succeed? Of course! \n\
                    You'll have to do your best, as there are no sure things in anything in life without one's best efforts, but with the forces \n\
                    of these planets and their Path behind you, succeed you will, in a way beyond simple emotional gratification. It has also \n\
                    honed your psychic faculties, and you experience new depths and power in your own genuine, spiritual nature. A strange \n\
                    inner transformation, precipitated by a series of mundane concerns and events, has occurred. You are the winner on all Fronts!\n\
                    <br/><b>Exemple of Use 2:</b> You have been thinking seriously about ways to advance yourself or about advancing some  personal \n\
                    interest of yours -- one that requires a long term commitment. You realize such an effort will demand a great deal of expended \n\
                    physical energy over time, and even more mental energy. Say you are thinking of going back to college to finish your degree \n\
                    or acquire an advanced one, or of making of a long term contract of either a business or personal nature, such as marriage. \n\
                    It's a Tuesday, during the Jupiter Hour, and what you consider to be the perfect opportunity to fulfill this inner need \n\
                    presents itself to you. Flow is down the Tree, and the Strength card of the 19th Path is thus invoked. Should you go for it? \n\
                    Absolutely. While the more mundane influences of Mars and Jupiter will most certainly enter into the matter very strongly, \n\
                    the balance of this 19th Path will mediate their incluences in such a way, that the source of real energy behind the venture --- \n\
                    the psychic force or spiritual power --- will guide and support you throughout the entire project: from its wishful \n\
                    beginning, through to its successful conclusion.",
                    19,
                    8
        ]);

        //Mercury Day
        influences.push([   
                    8,
                    6,
                    "Positive",
                    "<b>Exemple of Use 1:</b> \n\
                    <b>Exemple of Use 2:</b> .",
                    25,
                    14
        ]);
        
        
        //Jupiter Day
        influences.push([   
                    4,
                    5,
                    "Negative",
                    "<b>Exemple of Use 1:</b> You have a difficult project and you have no more strength. Someone finally calls you for a meeting. \n\
                    Here the flow is up the Tree. That is, from the Mars Hour into the Jupiter Day. Tarot Card VIII Strength is in the reversed position \n\
                    due to the upward flow. In this reversed position, the card stands for power and strength, but physical in nature. It \n\
                    highlights endurance and determination in matters, but those matters that require physical strength and physical prowess \n\
                    through which the qualities of endurance and determination are sustained. \n\
                    Since the physical aspects are stressed here, your preparations for this meeting may contain the same elements as in \n\
                    the previous example, but they will lack the psychic or spiritual component needed to close the deal, and you will feel \n\
                    his lack during the preparations. Besides your preparations harboring this void, the delivery of that presentation  and \n\
                    the response of your interested client, will also be missing this key ingredient. While you may not lose out immediately, \n\
                    the client will express a somewhat feigned, halfhearted interest at first, which you will clearly sense. At some point, \n\
                    the deal will eventually fall through, in which case, you may very well have abandon you further efforts to get this project \n\
                    off the ground. A very tenuous aspect always appears with the Strength card in the reversed position, but I have given you \n\
                    about as clear example of its strange influence as I can in this instance.\n\
                    <b>Exemple of Use 2:</b> You want to begin new study or upgrade your degree. The opportunity presents itself during a Jupiter Day, \n\
                    during a Mars Hour. As such, flow is up the Tree, and Card VIII Strength of the Tarots is in the reversed position. As occurred in \n\
                    Exemple of Use 1 , the occasion that presents itself will be filled with purely physical energy and drive, but lacking any \n\
                    appreciable spiritual energy or psychic content whatsoever. Thus it will eventually fail outright over time or produce \n\
                    such unfavorable results that you wind up dropping the matter or backing out of it in some way. Again, use care with this reversed \n\
                    card influence.",
                    19,
                    8
        ]);

        //Saturne Day
        influences.push([   
                    3,
                    5,
                    "Negative",
                    "<b>Exemple of Use 1:</b> It's a Saturday, you're are going to loose you job and the situation of the company is desastrous. \n\
                     Knowing this, you decided to go into your office on your own time, and clear up some paperwork. It's really a self-reassuring \n\
                    attempt on your part meant to ease your fears of your impending -- perhaps inevitable ? --discharge. You are not looking for praise \n\
                    or accolades from anyone. You are just concerned about the stabily of your employment, and in the back of your mind your are thinking \n\
                    that such actions just might help your situation. \n\
                    Coincidentally, your boss is in his office. He hears you come in, and seizes the opportunity to have a private talk with you. \n\
                    Beacuse of the day and hour, and the fact that the flow is up the Tree, and the Card VII of the Tarot, The Chariot, is reversed. \n\
                    Do yourself a favor. Listen to him politely, immediately return home, and start preparing for what is now inevitable unemployment. \n\
                    It doesn't matter one iota that your boss told you the same things he (would have) told you that Tuesday during a Saturn Hour into a \n\
                    Mars Day. In this example, it occured with a Mars Hour flowing into Saturn Day, and the card is reversed. You will lose your job. \n\
                    The best thing you can do in this situation is try to get over the shock as soon as you can, and get a jump on all those others \n\
                    who will be trying to find employment in the area in which you live. Start looking for new work on Monday.\n\
                    <b>Exemple of Use 2:</b> You see your body in a mirror and you're disgusted. It's a Saturn Day, Mars Hour, and the flow is \n\
                    up the Tree. In other words, the negative aspect of Card VII The Chariot applies, since the card occupies the reversed position. \n\
                    In this case, you would simply note the impulses, forget about the exercice machine or club memship, and wait until a more favorable \n\
                    day and time set of influences, and explore this pressing issue again. If you do this, you will be surprised to find that \n\
                    some completely new idea for effectively dealing with your unhealthy situation just seems to pop into your mind, or that \n\
                    you just happened to see some new device on television that targets your problem. And you can count on the decision/action \n\
                    combination you take at that time to succeed, because it will!",
                    18,
                    7
        ]);
        
        
        influences.push([   
                    3,
                    6,
                    "Negative",
                    "Exemple of Use 1: You are looking to make a real estate investment. Someone approaches you out of the blue, \n\
                    on -- curiously enough -- a Saterday, during a Sun Hour with what sounds like a ideal offer. \n\
                    The flow is up the Tree, and hence the Tarot Card, the Lovers, is reversed. Should you now enter into this deal? \n\
                    Run from this offer as fast as you can because some new variable will be operating in the background that will bring \n\
                    total and complete failure to the venture, and total loss of your investment. <br/>\n\
                    Exemple of Use 2: You make plans for personal growth and go to work on them during a Saturday during an hour ruled \n\
                    by the Sun. See the problem? Of course you do. There is an upward flow from the planet ruling the hour, into the planet \n\
                    ruling the day. Result: about as good as when you evolved your ideas during the Mercury Hour of this day, which was \n\
                    another upward flow. They will fail, for one reaon or another.",
                    17,
                    6
        ]);
        
        

//        influences[1] = [   
//                    3,
//                    6,
//                    "Negative<br/>\n\
//                    <b>Influences of the Planets connected by the Path</b><br/>\n\
//                    ",
//                    17,
//                    6
//        ];

                
//        influences[0] = [   1,
//                            1,
//                            "",
//                            0,
//                            0
//                ];
        
        //fill the influences
        var daySephiroth,hourSephiroth,polarity,description,path,tarot;             
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<influences.length;i++){
                daySephiroth = influences[i][0];
                hourSephiroth = influences[i][1];
                polarity = influences[i][2];
                description = influences[i][3];
                path = influences[i][4];
                tarot = influences[i][5];
                
                var sql = "INSERT INTO influences (daySephiroth, hourSephiroth,polarity,description, path,tarot "+
                        ") VALUES (?,?,?,?,?,?)";
                transaction.executeSql (sql, [daySephiroth,hourSephiroth,polarity,description, path ,tarot],ok, error);
            }                    
        });
        
        

        //Set the data status
        this.db.transaction (function (transaction) 
        {
            var sql = "INSERT INTO status (property, value) VALUES (?, ?)";
            transaction.executeSql (sql, ["synchronized", "true"],ok, error);
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
        jQuery('#dayRuler').html("");
        
        var sephirah;
        
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT * FROM weekdays WHERE id=?";

            transaction.executeSql (sql, [day+1],
            function(transaction, result){
                if (result.rows.length){
                    day = result.rows.item(0);
                
                    sql = "SELECT * FROM sephirah WHERE name=?";
                    transaction.executeSql (sql, [day.sephirah],
                    function(transaction, result){
                        if (result.rows.length){
                            sephirah = result.rows.item(0);
                            console.log(sephirah);
                            jQuery('#dayRuler').html(sephirah.name + '('+day.planet+')');
                        }
                    }, error);
                }
            }, error);
        });
        return;
    };
    
    DBService.prototype.updateInfluence = function (daySephirah, hourSephirah, callback){
        jQuery('#influence').html("");
                
                
        console.log(daySephirah + " --- " + hourSephirah);     
        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT * FROM influences WHERE daySephiroth=? and hourSephiroth=?";

            transaction.executeSql (sql, [daySephirah, hourSephirah],
            function(transaction, result){
                if (result.rows.length){
                    var influence = result.rows.item(0);
                    callback(influence);
                }
            }, error);
        });
        return;
    };
        
    
    // export as AMD module / Node module / browser variable
    if (typeof define === 'function' && define.amd) define(DBService);
    else if (typeof module !== 'undefined') module.exports = DBService;
    else window.DBService = DBService;
    
}());
