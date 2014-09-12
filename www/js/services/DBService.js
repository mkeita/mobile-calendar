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
                            "astrological_attribution VARCHAR(100), "+
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
                    "alphabet_position VARCHAR(100), " +
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
        var name,number,primary_title,other_titles,astrological_attribution,intelligible_qualities,
                human_experience,sensible_qualities,color_tree, color_scale,
                elemental_attribution,polarity,tarot_card,commentary;
        
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<sephiroh.length;i++){
                name = sephiroh[i][0];
                number = sephiroh[i][1];
                primary_title = sephiroh[i][2];
                other_titles = sephiroh[i][3];
                astrological_attribution = sephiroh[i][4];
                intelligible_qualities = sephiroh[i][5];
                human_experience = sephiroh[i][6];
                sensible_qualities = sephiroh[i][7];
                color_tree = sephiroh[i][8];
                color_scale = sephiroh[i][9];
                elemental_attribution = sephiroh[i][10];
                polarity = sephiroh[i][11];
                tarot_card = sephiroh[i][12];
                commentary = sephiroh[i][13];
                
                var sql = "INSERT INTO sephirah (name, number,primary_title,other_titles,astrological_attribution,"+
                        "intelligible_qualities,human_experience,sensible_qualities,"+
                        "color_tree,color_scale,elemental_attribution,polarity,tarot_card,commentary"+
                        ") VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                transaction.executeSql (sql, [name,number,primary_title,
                                                other_titles,astrological_attribution,intelligible_qualities,
                                                human_experience,sensible_qualities,color_tree,
                                                color_scale,elemental_attribution,polarity,tarot_card,commentary],ok, error);
            }                    
        });


        //Fill the paths
        var path = new Array();
        path.push([11,
                    1,
                    2,
                    "Aleph (Hebrew letter, 'A'), meaning, the head of an Ox.",
                    "1",
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
                    "2",
                    "The Transparent Intelligence",
                    "the combined natures of the Sephiroth Chokmah and Hod are reflected by this Path. Their properties are Mercurial, here, in an alchemical sense of Universal Mercury, as hinted at in the section Hod. That is, due to the higher octave of this Path, the Mercurial nature expressed herer is more in line with the Intelligible Quality found in  the Mercury of the Philosophers, which can be reached through the higher aspects of the Sensible Qualities of Hod; Initiated working in the realms of Philosophic and Laboratory Alchemy. This Mercurial Principe is therefore that living ever-changing Principe of cohesive force that holds all of Creation together, from the subtlest of matter to its most material form.",
                    "the planet, Mercury, nut with the understanding given above.",
                    "Tarot Trump, One(I) --- The Magician."
                ]);

        path.push([13,
                    1,
                    6,
                    "Gimel (Hebrew letter, 'G'), meaning Camel.",
                    "3",
                    "The Uniting Intelligence.",
                    "The portal of entry into an Inner Magical Sanctum or College of the Masters, as understood by advanced practi¬tioners of Magic",
                    "the 'planet' Moon",
                    "Tarot Trump, Two (II)¬The High Priestess. "
                ]);

        path.push([14,
                    2,
                    3,
                    "Daleth (Hebrew letter 'D'), meaning, Door.",
                    "4",
                    "The Luminous Intelligence",
                    "The force by which opposites are attracted to each other. Due to the Basal Attribute assigned to rhis Path, the implication is one of Love, although in a higher aspect. In this instance, a Love whose end result of uniting the oppo¬sites, produces a mystical creation and experience through the act of union",
                    "the planet, Venus",
                    "Tarot Trump, Three (III)¬The Empress."
                ]);

        path.push([15,
                    2,
                    6,
                    "Heh (Hebrew letter 'H'), meaning, Window",
                    "5",
                    "The Constituting Intelligence.",
                    "Although many martial characteristics are applied to this Path due to its Basal Attribution, the higher aspect of this Path is of more interest and use to us here. This Path is associated with the alchemical Principle of the Sulphur, itself a fire related concept exhibiting energy, and the pene¬trative dynamics of the mind, the mental dynamics being equally fiery when used properly. Why this latter corre¬spondence? Because to those initiated into Alchemy, the alchemical Sulphur possesses a physical vehicle, the exact nature of which depends upon which of the Three King¬doms of Nature from which it is extracted. It is this vehicle which embodies and actually contains the consciousness of the substance being worked upon alchemically. ",
                    "the Zodiacal Sign of Aries",
                    "Tarot Trump, Four (IV)-The Emperor"
                ]);

        path.push([16,
                    2,
                    4,
                    "Vav (Hebrew letter 'V'), meaning, a Nail",
                    "6",
                    "The Son of Tetragrammaton",
                    "In its higher aspects, this Path is symbolic of the act of Redemp¬tion, and the Joy that issues from that redemption..",
                    "the Zodiacal Sign of Taurus",
                    "Tarot Trump, Five (V)-The Hierophant"
                ]);
                
        path.push([17,
                    3,
                    6,
                    "Zayin (Hebrew letter 'Z'), meaning, Sword",
                    "7",
                    "The Disposing Intelligence",
                    "Again, in its higher aspects, this Path is symbolic of the Primal Force behind all of the fabricating and forging forces within Nature, and is symbolic of the depths of the consciousness of Nature itself.",
                    "The Zodiacal Sign of Gemini.",
                    "Tarot Trump Six (VI)-The Lovers"
                ]);

        path.push([18,
                    3,
                    5,
                    "Cheth, pronounced using the guttural 'Ck' sound made in pronouncing the word 'rock' (Hebrew letter 'CH'), meaning, Fence",
                    "8",
                    "The House of Influence",
                    "The process by which accomplishing the Great Work itself. Also the Work, Devotion, Dedication, Com¬prehension and Understanding, by which one comes to grasp the reality of Kether, through the Accomplishment Kabbalistic Cycles and the Mastery of Life of the Great Work. Occult Concept of Path: the first step of the process in the Attainment of the Great Work, which is the Attainment of the Knowledge and Conversation (K&C) of the Holy Guardian Angel (HGA).",
                    "the Zodiacal Sign of Cancer.",
                    "Tarot Trump Seven (VII)-The Chariot."
                ]);

        path.push([19,
                    4,
                    5,
                    "Teth (Hebrew letter 'T'), meaning, Serpent",
                    "9",
                    "I refer to this Path as 'The Alternate Path,' uniting the opposites of the male potency of Chesed, with the female potency of Geburah; the Path joining the opposites of Mercy and Severity, as shown by the Chesedian-place¬ment on the Pillar of Mercy, and the Geburahian-situated Sephirah on the Pillar of Severity.",
                    "Although the Serpent is assigned to this Path due to its association with Teth, the Lion is also a corollary of this connecting pathway between Chesed and Geburah. In the higher aspects of this Path's meaning, it is the Lion which is of interest here, having a very special meaning in Alchemy: the production of-at first a menstrum-termed the 'Green Lion,' from which the Stone of the Wise is eventually produced. By allegory, it also has implication for that psycho-spiritual process of self-transformation through which the 'lead' of Man's lower nature is trans¬muted and united with the Higher Nature that dwells within the deepest recesses of the Self. ",
                    "the Zodiacal Sign of Leo.",
                    "Tarot Trump, Eight (VIII)-Strength"
                ]);

        path.push([20,
                    4,
                    6,
                    "Yod (Hebrew letters 'I', 'Y'), meaning, a Hand, but with the index finger pointing, and the other fingers closed, forming a Fist, which is also the meaning of this Path",
                    "10",
                    "'The Forceful Intelligence' as I term this Path, owing to the nature of its higher meaning, as given in the Occult Concept",
                    "The movement of the One Consciousness through which the forces of the universe have been set in motion.",
                    "the Zodiacal Sign of Virgo",
                    "Nine (IX)-The Hermit"
                ]);

        path.push([21,
                    4,
                    7,
                    "Kaph (Hebrew letter 'K'), meaning, a cupped hand, or spoon.",
                    "11(20)",
                    "The Conciliatory Intelligence",
                    "With its higher aspects through its Intelligible Quality of the pure, expansive, open nature of Chesed to its Sensible Jupiteranean influ¬ence which is eventually united or conciliated with the Intelligible Quality of Netzach, being the Vision of Beauty, it is then expressed in the World of Malkuth through the Venusian Sensible Quality of Love. In effect, a conciliation occurs between the Sensible Qualities projected by the planetary attributions of these two Sephiroth into the lower worlds. Yet, this same act of conciliation also occurs between the higher aspects of these two Sephiroth. What we have as a result of this conciliatory act is a balance between the Intelligible and Sensible Qualities of these spheres, each on their own plane, yet complementing each other on their respective planes of existence through the nature of this Path",
                    "the planet, Jupiter.",
                    "Tarot Trump, Ten (X)¬The Wheel of Fortune."
                ]);

        path.push([22,
                    5,
                    6,
                    "Lamed (Hebrew letter 'L'), meaning, a Whip",
                    "12(30)",
                    "The Faithful Intelligence",
                    "This Path has a combined meaning, much as did Kaph. Here we find the higher aspects of balance, justice, equity, and law, but ruling not only in the higher realms, but dispensing its lawful decrees in the world of Men through action/reaction. In this way, the Path exerts a leveling influence on the actions of mankind through a cause/effect relationship. The results stemming directly from those actions are thus brought about without regard to emotional appeal, social convention, or excuse.",
                    "the Zodiacal Sign of Libra.",
                    "Tarot Trump, Eleven (XI)-Justice"
                ]);

        path.push([23,
                    5,
                    8,
                    "Mem (Hebrew letter 'M'), meaning, Water",
                    "13(40)",
                    "The Stable Intelligence",
                    "The higher aspects of this Path refers to Mankind in a state of sin, unredeemed, but possessing that spiritual nature which will lead him to his ultimate Salvation.",
                    "the Element, Water.",
                    "Tarot Trump, Twelve (XII)-The Hanged Man."
                ]);

        path.push([24,
                    6,
                    7,
                    "Nun (Hebrew letter 'N'), meaning, Fish",
                    "14(50)",
                    "The Imaginative Intelligence",
                    "The higher aspects of this Path have a two¬fold attribution. The first is reflective of the alchemical process of Putrefaction that leads to the stage of Regenera¬tion. In this case, reference is made to the Work on the Stone of the Wise. Through this process, the former physi¬cal, putrefied base material is exalted through a spiritual unfoldment and psychic development on the part of the alchemist, eventually leading to the physical manifestation of the Philosophic Substance in the laboratory. This is a highly elevated activity of the Sensible Qualities of this Path. It is this laboratory operation that combines the unfoldment of the alchemist with the 'first part' of the laboratory alchemical act-using the 'First Trinity Process' as I term it-of Maceration, Digestion, and Cohoba¬tion, to produce the Black Dragon. This seemingly dead substance is then used to produce the Philosophic Sub¬stance through the 'Second Trinity Process' of Separation, Purification, and Cohobation. The second meaning of this Path is its reference to the spiritual process which mirrors the laboratory process exactly: The Dark Night of the Soul, a time in which the individual undergoes the stages of Separation, Purification, and Cohobation, but within his or her own nature, so that the Light of the Spirit within them becomes manifest throughout their entire nature: physical, psychic, and spiritual.",
                    "the Zodiacal Sign of Scorpio.",
                    "Tarot Trump, Thirteen (XIII)-Death. "
                ]);

        path.push([25,
                    6,
                    9,
                    "Samech (Hebrew letter 'S'), meaning, Prop.",
                    "15(60)",
                    "The Tentative Intelligence",
                    "Once again, in its higher aspect, the individual's ascent to the Holy Guardian Angel is implied by this Path. Notice the 'upward' movement from Yesod into Tiphareth: the latter being the realm of the HGA. The ascent is thereby through the world of Yesod, the foundation for all magic that is to have an effect in the world of Malkuth (See entry under Yesod in the section on the Sephiroth.) Yesod also takes the correspondence of the unconscious mind, that gateway leading to the realm of ritual and ceremonial magic, and through them, upward toward the HGA.",
                    "the Zodiacal Sign of Sagittarius.",
                    "Tarot Trump, Fourteen (XIV)-Temperance."
                ]);

        path.push([26,
                    6,
                    8,
                    "Ayin (Hebrew letter, 'O' (nasal), meaning, an Eye.",
                    "16(70)",
                    "The Renovating Intelligence",
                    "The higher aspect of this Path is indicative of that creative, innate spiritual power of God existing within the individual. If this God-power actually manifests itself within the individual, that person becomes as a semi-divine being, partaking of both the nature of a man and a God. He or she knows their True Will, is exalted thereby, and begins the arduous process of liberating the world through the exercise of that True Will in the world of mankind.",
                    "the Zodiacal Sign of Capricorn.",
                    "Tarot Trump, Fifteen (XV)-The Devil."
                ]);

        path.push([27,
                    7,
                    8,
                    "Peh (Hebrew letter 'P'), meaning, Mouth.",
                    "17(80)",
                    "The Exciting Intelligence",
                    "This Path exhibits the correspondence of Mars by virtue of its Basal Attribute, and consequently of the Sephirah Geburah in general, but in a more mundane manner. That is, it represents raw force, which although destructive in nature, yet has an implication in terms of a higher aspect in that it leads to a position of exalted spiri¬tual, psychic and magical power, by he or she who sur¬vives the test of its raw, destructive force. Additionally, in a purely mystical sense, it endows every being in existence with spirit and movement, thereby giving motion to all life. ",
                    "The planet Mars.",
                    "Tarot Trump, Sixteen (XVI)-The Tower."
                ]);

        path.push([28,
                    7,
                    9,
                    "Tzaddi (Hebrew letters 'Ts' or 'Tz'), mean¬ing, a Hook, or a Fish Hook.",
                    "18(90)",
                    "The Natural Intelligence.",
                    "The feminine aspects of both the Moon and Venus which correspond to the two Sephiroth so joined by this Path, indicate the fem¬inine nature of this Path as well. Through its creative im¬pulses of this Path, Creation throughout the natural world is perfected and made whole.",
                    "the Zodiacal Sign of Aquarius, though an Air Sign, is attributed to this Path, owing to its Water-Bearer symbology.",
                    "Tarot Trump, Seventeen (XVII)-The Star."
                ]);

        path.push([29,
                    7,
                    10,
                    "Qoph (Hebrew letter 'Q'), meaning, the Back of the Head.",
                    "19(100)",
                    "The Corporeal Intelligence.",
                    "While there are a host of attributions and correspondences assigned to this Path, none of them truly explain its nature. My own metaphysical and magical investigations of this Path have shown it to be a type of channel in the Astral Light through which those spiritual, psychic, and material desires and wants of the individual are made manifest. Specifically, I am referring to those magical acts that are intended to produce an effect in the physical world. It does not matter what Sephirah the magician may be working with-the role of Yesod as the foundation for all manifes¬tations of metaphysical, mystical, and magical work being taken into account, of course-it nevertheless appears that this Path is invoked automatically in translating those manifestations into physical form. It is a very powerful Path in this regard, and one that is all too often overlooked in magical work in particular, and in occult work in gen-eral. The meanings of the two Sephiroth involved, and this Path's effects, should be carefully studied by the modern occult and magical practitioner. ",
                    "the negative, or feminine, polarity: watery, Zodiacal Sign Pisces.",
                    "Tarot Trump, Eighteen (XVIII)-The Moon. (Notice the watery, female, creative aspects of the card in reference to the Occult Concept of the Path. Also, the reader would do well to consider the Lunar nature of this card as being the Planetary Attribution of Y esod, and the characteristic of this Path as a channel for material manifestation, as explained above.)"
                ]);

        path.push([30,
                    8,
                    9,
                    "Resh (Hebrew letter 'R'), meaning, a Head",
                    "20(200)",
                    "The Collecting Intelligence",
                    "All of the attributions of this Path are strictly solar. As such, they refer to the attributes and correspondences assigned to the Sephirah Tiphareth, and to its Sensible Qualities produced and governed by the Sun. It is therefore a Path that 'collects' the attributes of the Sun such as Light, Life, Love, and Growth of every type, as well as the attributes of Hod, and combines them with foundational characteristics of Yesod discussed earlier in preparation for bringing them down into Malkuth through the Thirty-Second Path. This part of the process of manifes¬tation in Malkuth-here, through Path 30-occurs in a masculine, fiery, and dynamic way, owing to the solar forces involved, as contrasted to the watery, passive, fem¬inine process used by the Path 28, Tzaddi (the Feminine, Passive nature of the Pillar of Severity of which Hod is a part notwithstanding.)",
                    "the First Planet of the Ancients, the Sun.",
                    "Tarot Trump, Nineteen (XIX)-The Sun."
                ]);

        path.push([31,
                    8,
                    10,
                    "Shin (Hebrew letter 'Sh'), meaning a Tooth.",
                    "21(300)",
                    "The Perpetual Intelligence",
                    "The fiery descent of Divine Wisdom and the dedication to live that state in the world of mankind. An example which conveys the princi¬ples behind such an awakening is found in the descent of the Holy Ghost upon the Apostles, enlightening them, and bringing about the resolve within each of them necessary to take the teachings of the Divine Christ to the people of the world, amidst the hostile Roman and Pagan forces that pressed upon them from every side. Recall also the Occult Concept of Path 30 as well, and its implication in this Hod¬to-Yesod and Hod-to-Malkuth connection.",
                    "the Element, Fire.",
                    "Tarot Trump, Twenty (XX)-The Last Judgment."
                ]);

        path.push([32,
                    9,
                    10,
                    "Tav (Hebrew letter 'T'), meaning, a Cross, and specifically a three-armed cross. That is, a cross shaped as the letter 'T.'",
                    "22(400)",
                    "The Administrative Intelligence",
                    "Besides the implication of the purpose of this 32nd Path given in the discussion for Path 30, Path 32 possesses a bittersweet characteristic, but only owing to the 'higher¬minded' of the Kabbalists who translated such a bitter¬sweet necessity as 'evil.' This 32nd Path is that portal or channel which allows the coarsest matter of the Astral Plane to enter the world of Malkuth, while also represent¬ing all existing intelligences throughout Creation at the same time. My personal experience of this Path has shown it to be, in reality, the Path that governs the mechanics of physical existence, which can be pointedly summed up as providing a common plane for the existence and expres¬sion of both good and evil, all at the same time. Thus, it is a stage wherein the drama of daily material, psychic, and spiritual life unfolds, grows, expands, interacts, and devel¬ops, with each of these facets of Creation set up according to its own rules and laws. ",
                    "The planet, Saturn",
                    "Tarot Trump, Twenty-One (XXI)-The World."
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
        tarots.push(["The Fool (O)",   
                    11,
                    "Foolhardiness in action; foolishness in thought and deed; wildly excessive behavior; extravagant behavior, thoughts, and proposi¬tions. A greatly exaggerated sense of one's own impor¬tance and position in life; fantastic ideas and speculations.",
                    "trouble stemming from the ex¬travagances listed above. Also difficulties from indecision, vacillation, and irresolution.",
                    ""
        ]);
        tarots.push(["The Magician (I)",   
                    12,
                    "power of the individual's resolve; appropriate skills to meet the task at hand; power of the will to effect the change desired; confidence in one's own ideas, abilities, and the determination to carry them through to completion.",
                    "conceit; lack of appropriate skills for the task at hand; lack of self confidence; lack of will to effect the change(s) sought; lack of individual power and resolve to effect the ends desired",
                    ""
        ]);
        tarots.push(["The High Priestess (II)",   
                    13,
                    "knowledge; deep thought; scientific thought, ideas, and all matters pertain¬ing to scientific education. Also, educational matters in general. Logical thought; rational thinking and cogent argument style; cognitive skills. ",
                    "illiteracy; ignorance; shallowness of thought and idea; surface knowledge; a lack of structure of the knowledge one is seeking.",
                    ""
        ]);
        tarots.push(["The Empress (III)",   
                    14,
                    "fecundity in all matters, prolific results; accomplishment; the act of doing, fruitful¬ness in all things; earthiness; creativity.",
                    "dissipation of one's energy; loss of power in gen¬eral; incomplete results due to hesitancy, indecision, or irresolution in acting.",
                    ""
        ]);
        tarots.push(["The Emperor (IV)",   
                    15,
                    "one's right or prerogative to rule or to determine for one's self; authority; command; control; domination; effective action; mastery; might; the power of reason; justification; the making of rationalizations that are right and just.",
                    "juvenile, childish emotions and their display; loss of authority, control, and command. Blocked plans and schemes.",
                    ""
        ]);
        tarots.push(["The Hierophant (V)",   
                    16,
                    "kindness; mercy; righ¬teousness; morality; virtue; the quality of goodness; a person who exhibits these high human qualities. ",
                    "excessive kindness; excessive mercy; weakness resulting from such excess; the inability to dis¬cern such excess, due to a lack of emotional control. ",
                    ""
        ]);
        tarots.push(["The Lovers (VI)",   
                    17,
                    "A trial in life or an experiment of a personal nature that you will successfully conclude; the emergence of a new affection or object of devotion, whether it be a person or a new interest of some type.",
                    "A failed life-trial or experiment; the loss of affection for a person or interest",
                    ""
        ]);
        tarots.push(["The Chariot (VII)",   
            18,
            "Victory, conquest, overcoming odds and obstructions, but only after battle.",
            "Defeat after battle; obstructions to plans and actions; plans and actions defeated by either internal or external obstructions and obstacles, but once again, only after battle.",
            "This card, and card XVI -- The tower, Path 27, Peh -- are the most difficult cards of the Greater Arcana. With either card, the plans made, the opportunities that arise, and the actions taken under their influence, have an extremely grim, major component to them. Of the two cards however, this card (VII) The Chariot, is perhaps surprisingly the hardest of the two to work with, even in its upright position, for it bespeaks of a long, arduous struggle which will take a heavt toll on the individual, even though he or she will become victorious (when it is in the upright position)."
        ]);

        tarots.push(["Strength (VIII)",   
            19,
            "metaphysical or spiri¬tual force and strength; inner strength which overcomes danger and adversity. The strength through which the Holy warrior battles against overwhelming odds, and victoriously subdues and overcomes a great threat. Subju¬gation of opposition through spiritual power.",
            "power and strength, but physical in nature. Endurance and determination in matters requiring physical strength, and the physical prowess through which these qualities are sustained.",
            ""
        ]);
        
        tarots.push(["The Hermit (IX)",   
            20,
            "deliberation, due to watchful attention, or a feeling of caution; a warning, things are not as they seem. Also, the furthering of psychic growth. ",
            "excessive self-admonition or over cautiousness in important matters; imprudent actions; ill-advised activities; indiscreet behavior.",
            ""
        ]);
        
        tarots.push(["The Wheel of Fortune (X)",   
            21,
            "beneficence; expansiveness; growth; money; good luck; good fortune; success.",
            "ill fortune; the reversal of dame fortune; hardship; loss; contraction; struggle; failure.",
            ""
        ]);
        
        tarots.push(["Justice (XI)",   
            22,
            "harmony, justice, stability; poise; equilibrium; balance.",
            "conflict, injustice; instability; imbalance, intolerance.",
            ""
        ]);
        
        tarots.push(["The Hanged Man (XII)",   
            23,
            "the acquisition of knowledge which eventually matures into wisdom. The process is slow however, and as with life in general, requires sacrifices on the part of the individual for that knowledge to ripen into wisdom.",
            "self-centeredness; concern for one's self exclusively at the obvious expense of others; sly, deceptive behavior designed to have one accepted by the group or masses.",
            ""
        ]);
        
        tarots.push(["Death (XIII)",   
            24,
            "physical death; an end; a massive, nebulous change or transforma¬tion in the individual, comparable to the end of a part of the self as occurs-for example-in the Attainment of the K&C of the HGA. ",
            "corruption; disintegration; decomposition through putrefaction; stasis. ",
            "this Path is not as difficult as it sounds. In reality, its meanings usually refer to the evolution and development of the Self through the process of self¬growth, the means used to achieve this state notwithstand¬ing. It is a hard path in terms of process, but its end results are stunning and utterly glorious."
        ]);
        
        tarots.push(["Temperance (XIV)",   
            25,
            "to unite or wed seemingly disparate concepts, ideas, or actions in a positive and beneficial way; the use of temperate or mea¬surable means and ways in thoughts and actions; a bal-anced approach to a problem, and the judicious implemen-tation of its solution. ",
            "disparate concepts, ideas, or actions which cannot be conjoined or united; disagreement; loggerheads; an extreme approach to a problem and its unbalanced implementation, which not only does not resolve the original problem, but which creates additional problems as a result of the extreme mea¬sures employed.",
            ""
        ]);
        
        tarots.push(["The Devil (XV)",   
            26,
            "an eventual beneficial or favorable result arises from a seemingly deleterious event or situation.",
            "that same situation produces a unfavorable or very unsatisfactory result, or is concluded in some negative and pos¬sibly harmful manner.",
            ""
        ]);
        
        tarots.push(["The Tower (XVI)",   
            27,
            "devolution; downfall; degeneration; decadence; disaster; calamity; tragedy; woes; catastrophe, disruption.",
            "the same, but to a lesser degree.",
            "this card, and card VII-The Chariot-along with their Paths, are by far the most difficult and dangerous Paths on the Tree. As you will see when working the Cycles System, their influence is to be watched for carefully at all times, and avoided if at all possible."
        ]);
        
        tarots.push(["The Star (XVII)",   
            28,
            "happy expec¬tation; joyful expectancy; happy prospects; an exciting future filled with many possibilities. ",
            "happy expectations and joyful expectancies are dis¬appointed or thwarted; emptiness; effeteness.",
            ""
        ]);
        
        tarots.push(["The Moon (XVIII)",   
            29,
            "secret ene¬mies; cunning on the part of others for their own ends; deceit; duplicity; concealed forces in operation; hidden enemies; conspiracies against the individual innocently involved in a matter or situation.",
            "the same, but to a lesser extent.",
            ""
        ]);
        
        tarots.push(["The Sun (XIX)",   
            30,
            "bliss; happiness; con¬tentment; joy; desires and goals achieved; wants satisfied;appeasement in general. ",
            "the same, but to a lesser extent.",
            ""
        ]);
        
        tarots.push(["The Last Judgment (XX)",   
            31,
            "rejuvenation; renewals of all types; outcomes reached; new beginnings; fresh starts. ",
            "problems causing efforts to bog down; delays; reversals; cowardly behavior.",
            ""
        ]);
        
        tarots.push(["The World (XXI)",   
            32,
            "completion; assured success; compensation; remuneration; repayment; recompense; a prosperous or thriving conclusion.",
            "stagnation, inertia; stasis; failed project or attempt; failure as a force, in general.",
            ""
        ]);
        

        //fill the influences
        var name,path,sensible_meaning_upward,sensible_meaning_reversed,commentary;             
        this.db.transaction (function (transaction) 
        {
            for (var i=0;i<tarots.length;i++){
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
                    "<b>Exemple of Use 1</b>: You are looking to make a real estate investment. Someone approaches you out of the blue, on -- curiously enough -- a Sunday, during a Saturn Hour with what sounds like a ideal offer. Should you take it? Yes! The downward flow of the heavy-handed but stabilizing influence of Saturn will blend with the growth desires stimulated by the Sun, to make this a very profitable investment indeed. The Path's influence will powerfully serve to bring about a very sucessful conclusio to the transaction, one you will long remember and grateful for. <br/>\n\
                    <br/><b>Exemple of Use 2:</b>  You make a plan for personal growth. You can use the heavy-handed, stabilizing influence of the Saturn Hour during this new Sunday to not only detail your plans, but to set down the steps necessary to hurl them at the world during the upcoming week. And you will succeed. Take that to the bank!",
                    17,
                    6
        ]);

        influences.push([   
                    6,
                    4,
                    "Positive",
                    "<b>Exemple of Use 1:</b> You have been looking for a chance to get in on the ground floor of a new business, or jump to a new position in your firm, or go off on your own and found your own company. Or maybe you have an opportunity to unload that old building or acre of ground that has been in your family for generations, and is now yours to do with as you please. It's a Sunday, and although no one usually concerns themselves with such matters on this day, a situation arises during the Jupiter Hour that will enable you to get started in this new direction you want to take. You have to deal with another individual to do so however, and a meeting is set between the two of you during a Sun Hour later in the evening, and the 20th Path of the Hermit is invoked thereby (because the issue began in a Jupiter hour.) What can you expect? First of all, your sense of caution will be alerted. It may be a tone in the other person's voice; or a slight skepticism you thought you noticed when you told him the price for the old building, or piece of ground; or that you are interested in jumping to the new position in the firm; or the like. The two of you finally meet during the Sun Hour, and both of you are a bit edgy: him for his reasons, you for yours. The meeting seems to go well, and you walk away content. Have you succeeded? I mean, have you gotten your way fully? Will your way truly work out in your best interests? The answer? Yes, to all. In fact, when you look back over the situation, you will see that it was your very caution that prompted you to act this way or that, say just the right thing or keep your mouth shut at just the right moment, or in some manner communicate a non-verbal message, in a certain way, that brought you the success you wanted in the matter. Count on it. You have a new desirable situation on your hands now, and one that will bear the mark of permanency. \n\
                    <br/><b>Exemple of Use 2:</b> Your've let it be known that you're interest in running for a local office, or for a position in your hobby club, church, or some organization in which you sincerely feel you can do more good than the individual who now occupies that chair. Nothing has come of your declaration over the months, and you've all but forgotten about it. Suddenly, on a Sunday evening, during a Jupiter Hour, you get a telephone call from the chief organizer or head of your group,organization, church or town council.Unknown to you, the right people have decided that you are the right man or woman for the job, and the voice on the other end of the telephone asks you to write a letter to so-and-so tonight, formally stating your qualifications, and outlining your plans for improving the club or organization. A note of caution rears up in your mind, principally because no one made you aware that they took the statements you made months ago seriously. But you are also aware of the planetary and Path influences, and that while such matters are typically negative under a Sun Day influence, this influence is moderated by the authority of the Jupiter Hour to a fourfold extent, while the Path influence provides an eightfold positive effect on the issue because of the Tarot Trump IX being in the upright position. So you courteously thank the caller, hang up, and set to work under this hour to produce the best written proposal that you can. Never mind it takes you half the night. The important thing is that you began the action under this influence, and as such, your written declaration will carry the imprint of the influence being exerted at this time. Will you get the position? Without question. In fact, it is amazing to note that your writing exercice will be coolly directed by the cautionary notee this Path influence produces. That is, the Path influence will act in such a way as to others, and that they ring true about who you are and what you have accomplished to date. And always, your projected image will be in the best possible light. In fact you will find that you are appointed to the position in question.",
                    20,
                    9
        ]);


        influences.push([   
                    6,
                    5,
                    "Positive",
                    "<b>Exemple of Use 1:</b><i> Note: Please pay special attention to this example. It contians a number of elements that are all too often found in challenging life-situations. While the example might sound obtuse at first, your careful study of it will probably reveal that it is more characteristic of 'sudden happenings' than you might like to readily admit. Be aware also, that  the general components of this example are applicable to many different situations in which you are forced to cooperate or act, usually against your will or better judgment.</i> You were about to embark on a new program designed to increase your psychic faculties. Yes, you were going to choose a more obvious, favorable time in which to begin this lengthy program of inner self-development, but some circumstance or another has literally forced you to begin it on a Sunday. You know all too well that the Solar influence of the day does not favor starting any new plan. Yet you also knox that the energy and dynamic nature of Mars is there to aid you, especially since the circumstance that has forced you into this position is one that has angered you greatly. You can feel the martial force urging you to begin your new plan during its influence. It power, overriding that of the Sun's influence of the day by a factor of four, gives you the confidence to proceed. You further feel that the injustice of the situation foisted upon you is also being met by the martial forces, and in your heart, you know your course of action is being set for you by the very forces of the Tree. You start your program of inner development during this day's Mars Hour, and immediately begin to direc your psychic energy at the root of the threat to its very cause. Path 22, with its downward flow from Mars into the Sun aids you. Its force of justice opposes the threat, while balancing your psychic exercice in such a way that the full force of equilibrium  and equity of this Path at first curbs, and then in the twinkling of an eye, dissolves the threat, while immobilizing its very source. Is all of this really possible? Can the influence of this planetary / Path combination aid you to such an extent in a matter in which your are totally innocent and without blame? Oh yes, most definitely. This is a very strange Path, and one that is not to be taken lightly. It has special uses as has been intimated here in this simple example, beyond its more mundane uses as will be seen in Example for Use 2. Your further study of Kabbalah will reveal more of this Path's austere and justice-oriented nature to you, while the force of the Path itself guides you in its righteous use. \n\
                    <br/><b>Exemple of Use 2:</b> You've been meaning to cut back on your alcohol consumption for some time now. Not that it's really out of hand, but you have noticed that you usually have two drinks at lunch time -- or has it grown to three? -- and the 'after work' cocktail has turned into four -- or is it five? -- over the course of the evening, whether you're simply watching television or finishing that woodworking project in the basement. Comme to think of it, you once had a life during the weekdays. You normally only 'threw back a few' on the weekends while watching the games, or going out with so-and-so for a social evening. But never mind, you're still at your job, well liked by everyone, and a pretty good 'Joe' or 'Cindy'. After all, life is tough, pressures abound from all sides, and everyone's stress levels are more often than not off the scale. 'Still, maybe I'd better stop or at least cut way back...'Your train of thought is suddenly broken by alternating blue and red flashing lights in the rearview mirror that are reflecting into your eyes. The meaning of the lights hits you like a brick across your forehead. Before you can slow down, those lights become accompanied by the wail of a siren. It's the police. You pull over to the side of the road, the officer emerges from his vehicle, stands off to the side of your car door, and in a voice somewhere between somber and curious, says, 'Good evening sir (or madam)! I couldn't help notice you swerved across the center lane a few times. Have you been drinking tonight?' Your heart -- now in your throat -- skews your normally resonant voice. 'I've been at my friend's watching the game (or playing Canasta). I did have a dring or two, but that was hours ago. I was thinking about something on the way home, and guess I wasn't watching where I was going! I'm sorry!'The police officer looks you squarely in the eye and replies 'Please step out of your vehicle, sir (or madam)! I have to determine if you are driving under the influence.' Shocked beyond belief, you comply. You know you had six drinks at least, and now the martial rage at your own behavior is driving your blood pressure through the roof. You can feel the pulsing in you neck as the officer gives you a field sobriety meter and asks you to blow into it. Your mind is racing, as feelings of guilt and fear course through your veins -- righ next to all that alcohol. The officer takes the meter from you, shines his flashlight on it, and says, 'Well, it looks like this is your lucky night! Your measure an alcohol level just .02 under the legal limit. If I were you, I'd get back in my car and head home immediately, and say a prayer. Because I can tell you, from the way you were driving, I suspected you would read at least .15 on my meter. Take this as a warning, and learn to control your drinking.'When you get back home, after calming down, you happen to think of the cycles, and take a look at your lastest chart. To your absolute disbelief, you find the cop stopped you during a Mars Hour on this Sunday, the flow down the Tree was with you, and you escaped a very expensive and socially damning nightmare that could have ruined the rest of your life. But how could this be? How could the force of Justice that lies behind the 22th Path have aided you? You were irresponsible in your drinking, and you know it. But then, you were questioning yourself as you were driving home. You began to see what you were doing to yourself and to others through your negligent behavior. Did the concept of Justice and balance behind this Path help you? What do you think? You will find many strange and wonderful effects, and no end of guidance, through the diligent use of the Tree and its components. As your author, I strongly suggest that you listen to that council closely, and give thanks for the blessings that the Tree can -- and will -- confer upon you, when you work with it correctly, knowledgeably, and in good conscience.",
                    22,
                    11
        ]);

        influences.push([   
                    6,
                    6,
                    "Positive/Negative",
                    "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                    -1,
                    -1
        ]);

        influences.push([   
                    6,
                    7,
                    "Negative",
                    "<b>Exemple of Use 1:</b> The conditions of the above exam¬ple are in effect once again, except in this case, you returned home from some activity or other on a Sunday, during a Venus Hour. Flow is up the Tree, from the hour into the day, and hence the 13th Tarot card is in the reversed position: the forces of corruption, disintegration, decomposition through putrefaction, and stasis are in full effect. You walk in, find your partner watching television or otherwise occupying themselves, and begin the same meaningless diatribe that helped extinguish the fire your relationship once knew. Sooner than later, each of you is off on their own in the same house, doing what pleases each, and avoiding each other at all costs. This evening-like all other evenings¬passes uneventfully, and neither of you care. Sex is a thing of the past. Both of you receive more mental stimulation from watching the Weather Channel than you do from each other, and life drags on, and on, and on, and on. Stagnation and the putrefication it produces that leads to the complete decay of human feelings and joy, has destroyed both of you. But it has progressed so far, that neither of you care about ending it. Both of you have been engulfed by the miasma of complacency. There is nothing for either of you to look forward to except an old age that will finally-and mercifully-put both of you out of your joint misery. Notice how your fear of this card in its upright posi-tion-when flow is down the Tree from the Sun Hour into the Day of Friday-might have dwindled considerably within you as you read the above. Ask yourself this. Of the two examples given here for this card, which one would you rather experience? I bet I know, even if you are not yet ready to admit it to yourself.\n\
                    <br/><b>Exemple of Use 2:</b> You're opening your new store in the last example on-of all days-a Sunday, during a Venus Hour. Of course, all that business consultation you paid for through the nose tells you that despite appear¬ances, people's last minute weekend buying habits are what you are going after to get your business off with a bang. As the months pass, you did everything that you did in the above example, but business has been slow. (static) No matter what you try, your sales limp along, allowing you to barely make your monthly business loan payments, your payroll, add some new merchandise here and there, and ever so slightly eke out the most marginal living for yourself. Eventually, the shifting scales will go completely against you, and your business will fail. There will be harsh consequences as a result, that will spread into your personal life as well, from which it will take you in all probability, years to recover. Such are the implications and effects arising from this card in the reversed position.",
                    24,
                    13
        ]);
        
        
        influences.push([   
                    6,
                    8,
                    "Negative",
                    "<b>Exemple of Use 1:</b> Remember that example in the earlier part of this chapter where the planetary force of Sunday put you in a growth mode? You took to working out the details during a Mercury Hour in that example, but accomplished very little on your goal during the ensuing week: each day had its particular limiting condition, as you'll recall. The following Sunday rolled around, you were painfully reminded of your failure to do something significant toward your goal during the past week, and started again in a new, bright-spirited way. No matter. Unless you apply your knowledge of the Kabbalistic Cycles on this next Sunday, you'll fail again because as you know by now, the problem was the flow on the Tree. During a Mercury Hour on Sunday in that example, flow was up the Tree, the card is reversed, and the negative influences of the Tarot in question manifest. In this case, card XV Devil meaning essentially, failure.\n\
                    <br/><b>Exemple of Use 2: Quite simply, there aren't any for the reasons given above. A void this Path influence and of course, the planetary influences connected by it in this instance. It will bring you nothing but trouble.</b> ",
                    26,
                    15
        ]);
        
        influences.push([   
                    6,
                    9,
                    "Negative",
                    "<b>Exemple of Use 1:</b> It's Sunday. That job interview you had last Friday has you nervous. This is your last chance to get a job in your area, and you've got to land it! You can't wait until tomorrow to ask your former employer for that letter of recommendation. So out of sheer anxiety, you give him a call during a Moon Hour, flow upward, from the hour into the Sun Day, and timidly ask if he will do you this favor, and that you need the letter for tomorrow. He feels guilty for having had to let you go, and so eagerly agrees to write the letter and has it ready for you by noon tomorrow. You pick up the sealed letter, take it to your prospec¬tive employer, and are asked to wait outside as before. Two hours later your soon to be new boss (you hope) comes out of his office and states, 'I'm sorry, Mike. While your letter of recommendation was good, it really only accents your machinist abilities and the talents that go with it. We just can't take a chance. Sorry. Good luck to you on your job hunt!' The effects of this Path in its upward flow have done it again: failed to unite conflicting opposites. And now you are stuck with the results.\n\
                    <br/><b>Exemple of Use 2:</b> During a chance meeting with your boss at the local sports grill, while he was feeling no pain and was lucid enough to remember, you asked him for that raise as you did in the example above. But this time it was on a Sunday, during a Moon Hour, flow upward, the card Temperance reversed. Oh, he took your case to the higher-ups as he said he would, and after due considera¬tion they refuse your request. 'We have to look out for all of our employees' interests these days, not just Joe's alone,' your boss tells you when he delivers the bad news. 'Joe's interests are at odds with the company's right now. Maybe when things get better we'll consider it.' That was their final words. As usual, this Path's upward flow damned the reconciliation of opposing interests. It hap¬pens every time.",
                    25,
                    14
        ]);

        //Moon Day
        influences.push([   
                    9,
                    3,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);
        
        influences.push([   
                    9,
                    4,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);

        influences.push([   
                    9,
                    5,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);
        
        influences.push([   
                    9,
                    6,
                    "Positive",
                    "<b>Exemple of Use 1:</b> You've been laid off permanently, and have been searching for work without success, that is, until last Friday. You finally have a real chance to land a new job, but it's in a totally different field. The ten years you spent as a machinist are now past, and you're facing a new position as a satellite dish installer. This new company is desperate for people, and so they entertain your application. But desperate or not, they are reluctant to hire you outright, owing to the investment they must make by putting you though a six-month training program, and are somewhat worried that your past skills just won't cross over to their type of work. They want a letter of recom¬mendation from your former employer. It's now Monday, Sun Hour. Knowing the Path influ¬ence of this hour /Path combination, you approach your former employer for that letter during this Sun Hour and Moon Day. Flow is downward, from the hour into the day, and he agrees. You take your letter to your prospective employer, give it to him, and are asked to wait outside while he reviews it and discusses it with his plant superin¬tendent and his own boss. An hour or so later he emerges from his office, smiles broadly, extends his hand to you and says, 'Congratulations, Mike! You're just the kind of guy we've been looking! We had no idea that a machinist had such skills! Welcome aboard! Can you start tomor¬row?' What happened? This particular influence unites or weds seemingly disparate ideas, actions, or situations in a balanced, complimentary way. Your former employer wrote that letter stressing your mechanical skills, reasoning abilities, mental clarity and gift of logic, loyalty, deter¬mination, and agreeable nature in such a way, that this new company could not help but hire you. Impossible, you say? I have seen similar situations arise a thousand times under these influences. Such are the forces that emanate from the downward flow of this Path.\n\
                    <br/><b>Exemple of Use 2:</b> You need a raise. The cost of living has gotten to you at last. You can barely meet your bills now, and are at your wit's end. But there is a wage freeze at your place of employment. Indeed, they have down¬sized, and those left feel fortunate they still have jobs. In short, your interests and those of your company's could not be more different. But you are forced to take a chance, and so during a Sun Hour on a Monday, with its down¬ward flow and upright 14th Tarot Card of Temperance, you approach your boss, plead your case, and remind him-nicely, of course-of all the overtime you gave, gratis, and the volume of work you have been putting out these past three months. He listens, says he will take it up with higher management, and summarily dismisses you. Two days later he calls you into his office, asks you to sit down, smiles, and delivers the verdict. 'Joe, I can't believe it myself, but you got that raise you need! I ex¬plained how well you've been doing, and what an asset you are to the company, and asked them to do their best to show their gratitude, even during these rough times. And they went for it! Your raise begins immediately, and will show up in your next paycheck! Congratulations!' As you can see, even extreme cases of disparate interests and con¬flicting desires can be reconciled through this 25th Path, if you know how to use it properly. And now you do!",
                    25,
                    14
        ]);
        
        
        influences.push([   
                    9,
                    7,
                    "Positive",
                    "<b>Exemple of Use 1:</b> I'll bet the business that poor guy opened under the Death card's influence in Example 3 of Path 24 is still fresh in your mind. Good! Because if he would have opened that same business on a Monday during a Venus Hour so flow was down the Tree from the Hour into the Day, I could have guaranteed that poor guy his enterprise would have taken off like a rocket. And if his product line in any way appealed to women, was in edu-cation-as in books-or was in art supplies, paintings, or even a bookstore that carried a line of art and the more literary type of publications, or items that strictly appeal to one's sense of luxury and extravagance and not necessity¬that same individual would be a most happy business man (or woman) indeed!\n\
                    <br/><b>Exemple of Use 2:</b> You've decided to pop the question. After years of the dating scene, you've had about all you care for of the empty-headed, gold-digging, utterly vain and absolutely egotistical, available women out there. Oh, they're available, as you come to realize in your thirtieth year of life. Available for a quick trip to the altar, a quicker trip to the divorce court, alimony, child support, and all of the other wage attachments that will have you living in a one-room efficiency apartment for the next twenty-odd years. But this last lady you've been seeing for the past year and a half is different. Very different. You both hit it off, and in every conceivable way are the compliment of each other. It couldn't be better if you designed it yourself. And you've been wondering about her little signals. Is she trying to tell you to either put up or shut up? (Ask me, you dummy, or just go away and let me move on!) Are these the meanings behind that coyness and those few slight remarks favoring marriage she has been making lately? Enough is enough, you make your decision, and on this Monday evening during a surprise dinner you take her to, you pop the question. Of course, it's a Venus Hour, and the flow is down the Tree. The result? Remem¬ber the endings to those delightful fairy tales you enjoyed so much as a kid? 'And they lived happily ever after.' Because if you propose during this influence, both of your lives will be long, fruitful, and very happy together. And I wouldn't make such a sweeping statement if I wasn't abso¬lutely certain of it.",
                    28,
                    17
        ]);

        influences.push([   
                    9,
                    8,
                    "Positive",
                    "<b>Exemple of Use 1:</b> For four long years-maybe longer depending upon your major and financial situation¬you've struggled to get through college, produced the GP A you needed to get into a good graduate school pro¬gram, and have all of those applications to grad school sitting on your desk, ready to be filled out. Of course, this means you'll no longer starve either, because a reasonable stipend goes along with your fully paid graduate educa-tion-right up to that Doctorate degree. I'll bet you know what is coming next. Yes, you guessed it. Be sure to fill out all of those applications during a Mercury Hour, on the day ruled by the Moon, when the flow is down the Tree. The influence of this 19th card that symbolizes the forces of this 30th Path, will truly produce happiness, con¬tentment and joy, and all of your desires and goals achieved. Don't be one bit surprised if all of the schools you apply to accept you, and even go out of their way to recruit you. They could even reach the point of fighting each other, offering you competitive package after pack¬age, just to make sure you come to their school. And why not? You deserve it. Just use this so very fortunate Path correctly, and you will be ever so very, very glad you did!\n\
                    <br/><b>Exemple of Use 2:</b> Your company has called a very important business meeting, and you've been asked to 'fork out a new plan for increasing your own department's efficiency. But worse than that, the Vice President of Oper¬ations told you that it has to be extremely good. Why? Because they want to adapt it to the other departments as well. Since your department is leading the entire company in productivity right now, they figure you know some¬thing they don't, and want you to share it with the other department heads so the entire company will benefit. Work out your plan diligently, by all means. But if you have anything to say about it, schedule the meeting for a Monday, during a Mercury Hour, when you have the downward flow of the Tree with you. You'll be absolutely amazed how well your ideas will be received and imple-mented. And of course, you will receive some type of reward for it: whether a raise, a promotion with a sizeable increase, or a bigger expense account. You will benefit from this Path and its downward flow, and in a big way. So use it well.",
                    30,
                    19
        ]);

        influences.push([   
                    9,
                    9,
                    "Positive/Negative",
                    "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                    -1,
                    -1
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

        influences.push([   
                    5,
                    5,
                    "Positive/Negative",
                    "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                    -1,
                    -1
        ]);

        influences.push([   
                    5,
                    6,
                    "Negative",
                    "<b>Exemple of Use 1:</b> You were about to embark on a new program designed to increase your psychic faculties. Yes, you were going to choose a more \n\
                    obvious, favorable time in which to begin this lengthy program of inner self-development, but some circumstance or another \n\
                    has literally forced you to begin it on a Tuesday. \n\
                    You are tempted beyond belief to assume a defensive posture by using the influence of this 22nd Path of Justice. Or perhaps the idea \n\
                    of using the full force of the Path offensively, to strike back at the source of the threat by beginning your new psychic development \n\
                    program under its influence and directing the force toward the threat, has you by the throat. You know better, but your rage and fury -- \n\
                    themselves the direct impulses of Mars pouring into you in an uncontrolled way through the upward flow of the Path -- have blinded your \n\
                    better judgment, and you proceed during a Sun Hour. \n\
                    The result? Imbalance all around. What you unleash will rebound upon you, adding immeasurably to the miseries of the threat, to bring you to \n\
                    your figurative and literal knees. Once again you have a choice. Either learn to live and work in cooperation with the Laws  of the \n\
                    Holy Tree of Life, or be damned by them. It is as straightforward as this. \n\
                    <br/><b>Exemple of Use 2:</b> You have even been questioning yourself about your drinking habits, when a flashing lights of the police car attracted \n\
                    your attention. It's a Tuesday during a Sun hour. The flow is now up the Tree and the Tarot Trump of the 22nd Path is in reversed position: \n\
                    imbalance, conflict, instability, and injustice abound. The raw aggressive energy of Mars is mediated by the Sun, yes, and by a factor of four.\n\
                    But there is a grimness in the eightfold impact the Path is exerting in the matter. This time the officer is belligerent. Maybe he had a hard day, \n\
                    and has had enough of drunks running around the highways, and has even targeted you. You wonder, as he puts the handcuffs on your wrists, if in his \n\
                    foul mood he might have somehow made that sobriety meter read a little higher-like the 0.15 reading it regis¬tered this time, and which you certainly feel like inside. \n\
                    There's no way out of it now. You are under arrest for DUI. You won't be arraigned until tomorrow morning, which means you'll spend the night in jail, \n\
                    right alongside the dregs of society-and you are now one of them. You'll also miss work tomorrow, and everyone will soon know why. And what about the bail? \n\
                    Who is going to put up the $5,000 to get you out of the cell you're sharing with that big fellow Bubba, who keeps staring at you so affection¬ately? \n\
                    And where will the money come from for the lawyer fees? And of course, it will be in all the newspapers tomor¬row, under the 'Local Arrest' section. \n\
                    What about jail time? It was only your first offense, but the Law has been crack¬ing down hard lately, especially in your town? Now what? \n\
                    What happened? You had those same noble thoughts about cutting back or outright quitting your drinking that you would have had if the incident occurred \n\
                    on a Sunday during a Mars Hour as given in the previous example. Why didn't it work for you this time? I'll tell you why. The properties of this Path are \n\
                    very explicit here. In the case of reversed flow, imbalance, injustice, conflict and instability will dominate any situation, and as you found out, \n\
                    that includes a feedback effect that this Path actually has on itself! That's right. Upward flow on this Path causes a reflection of the Path forces upon itself, \n\
                    so that it destabi¬lizes its own effects when the card is in its reversed posi¬tion. It is as if it were a double-negative. And in fact-it is. \n\
                    You're in for a bad time of it now, and the final conclusion to your DUI will be very severe indeed. You will be extremely fortunate if you do not have to serve any jail time, \n\
                    because the influence of upward flow on this Path is merciless in the extreme, and that is as mild as I can put it. But look on the bright side. \n\
                    If you ever needed a reason to give up the booze, now you have it.",
                    22,
                    11
        ]);

        influences.push([   
                    5,
                    7,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);        

        influences.push([   
                    5,
                    8,
                    "Positive",
                    "<b>Exemple of Use 1:</b> Your drive and determination to attain mastery in your special interest is there just as in the example above, \n\
                    but with one very important exception: it has entered your mind and emotions during a Mars Day, during a Mercury Hour. Flow is up the Tree, \n\
                    and the orien¬tation of Tarot Trump XII The Hanged Man, is in the reversed position. Will your praiseworthy desires and newly initiated attempts \n\
                    utterly fail-this time? Not in the way you might think.\n\
                    Due to the reversed flow, you will find yourself grad¬ually decreasing the demands you place on attaining mas¬tery. Little by little, you will \n\
                    settle for less and less, so that the 'mastery' you eventually gain, will more or less resemble some state of proficiency, as opposed to the state \n\
                    of mastery you originally intended to reach. Settling for less is a reflection of the general attitude of the masses in all things; those masses \n\
                    that you might sneer at now, or even despise. Yet here you have adopted their justification in settling for scraps, and have rationalized away \n\
                    your 'need' for mastery.\n\
                    In effect, you have turned that need into the conve¬nience of proficiency. Neither will you gain any deep insight into your intellectual motives, \n\
                    thinking processes, and reasoning abilities under this influence. Nor will there be any evidence of an improved memory, a heightened ability \n\
                    to visualize images, or a clearer mind. No, there won't be any of these things. But then again, it may be all right after all. \n\
                    It simply depends on who you are, and what you want to do with your life. Here's where that oft¬touted, never understood construct of Free Will, \n\
                    will come to the fore. It will reassure you that your justifiable ratio¬nalization for settling for less makes perfect sense. Or does it? \n\
                    But then after all, it really is up to you.\n\
                    <b>Exemple of Use 2:</b> All original conditions remain the same, except that telephone call arrives during a Mars Day, Mercury Hour, and \n\
                    flow is up the Tree. Hence the 23rd Tarot Trump is in the reversed position. Under this influ¬ence, the best you can expect is a shell of \n\
                    the result achieved in Example of Use 3, above. Things will begin to go wrong immediately after you cut the check.\n\
                    It could be that some other investors pull out at the last minute, requiring more investment from you than you feel comfortable with, \n\
                    and you will have to back out. Or the scanty computer equipment needed to achieve the next level in growth is no longer available, \n\
                    and requires newer teckie nonsense with all of its bells and whistles, along with high priced teckies to run it, who turn out to be modern day \n\
                    'craftsmen' who can't even spell the word quality, let alone produce it. Or you could become greedy at the eleventh hour, and insist on this \n\
                    or that which strains the relationship between the owner and you, or makes demands that in some way eventually causes a decrease in tl\e quality of the final product.\n\
                    In the end, as an example, the publishing house decides to stop stitching the pages, and simply glues them to the cover like other trade \n\
                    paperback houses do. Or they are forced to use cheaper ink, smaller type, or some varia¬tion that turns out a product that only the masses \n\
                    will understand and appreciate. In the end, old customers will fade away, and orders will drop. But never fear! Those masses with their \n\
                    teckie mentalities will replace them. Oh, you'll make some profit, but the intellectual and emotional gratification you receive will be worth \n\
                    about as much as a two-dollar bill. Heed this example well. This is a very empty Path when flow is up the Tree, and I strongly advise you not \n\
                    to do anything important when its influence is in effect.",
                    23,
                    12
        ]);
        
        influences.push([   
                    5,
                    9,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);        

        //Mercury Day
        influences.push([   
                    8,
                    3,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);

        influences.push([   
                    8,
                    4,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);
        
        influences.push([   
                    8,
                    5,
                    "Positive",
                    "<b>Exemple of Use 1:</b> There's fire in your eyes, and a burning desire in your soul for that special knowledge \n\
                    you've been trying to get all of your life. Maybe it's the mastery of advanced mathematics, physics, or chemistry. \n\
                    Or maybe even getting serious about that amateur astron¬omy interest of yours that-as with that two thousand dollar \n\
                    telescope you just couldn't live without two years ago-has been relegated to the back of your mind and its counterpart, \n\
                    your closet. Or perhaps it's something as innocuous as getting that golf game of yours up to par where you want it. \n\
                    Or maybe it's pushing past an obstacle in attaining a certain psychic or spiritual state through a special meditation \n\
                    you've only been toying with thus far. Whatever the specifics, the Mercurial forces are prompting you to do something \n\
                    serious about it on this Wednesday, and you notice that the Hour in which this burning ambition came to you is ruled by Mars, \n\
                    and hence the energy behind your determination. Flow is down the Tree, from the Mars Hour into the Mercurial Day. \n\
                    You can feel it surging within you. As you begin to set about get¬ting into that course of study, to meditate, \n\
                    to grab that golf bag and head out to the course, or grab that telescope and start your trek to the darkest field \n\
                    you can find, you feel somber. Not sad, but realistic in a fresh and insightful way. You know that all of those past \n\
                    harebrained attempts at mastering this passion of yours were just insignificant ego-driven games, aimed at appeasing some \n\
                    impulse that arose from who knows where. As the memory stream of broken self-promises flows smoothly past your mind, you vow \n\
                    that this time you are not going to let yourself down. And under the aegis of this planetary /Path combination, you won't! \n\
                    Because now, during this time, and under these particular influences, you realize that mastery means just that: the attainment \n\
                    of knowledge and skill that far outdis¬tances mere proficiency. \n\
                    Perhaps the first serious glimmers of wisdom are mak¬ing their way across the now receding ego-generated darkness of your mind. \n\
                    You are slowly become aware that this effort will take time. It won't be accomplished in a day, a week, a month, or even a year. \n\
                    Rather, it will require a constant, steady effort. You will have to give up other desires for this time, but you wisely understand \n\
                    the neces¬sity of this. The going will be rough, as it is in attaining to all new knowledge or acquiring new abilities, but you are \n\
                    intent on seeing it through this time. And as long as you begin your plan actively under these influences, you will attain that which \n\
                    you desire. \n\
                    Along the way, you will gain deep insight into your intellectual motives, thinking processes, and reasoning abilities. Along with \n\
                    these benefits, don't be surprised to find that you have also acquired an improved memory, a heightened ability to visualize images, \n\
                    and a clearer mind. Yes, you can put it all down to starting your activity under this Mars-Mercury-23rd Path influence-and you will \n\
                    be glad you did!\n\
                    <b>Exemple of Use 2:</b> You've been doing well lately, in all areas of your life, and especially in the financial arena. \n\
                    Your job is secure despite the economic climate, you've made some investments that have paid off handsomely, and all in all, \n\
                    you're enjoying your prosperity and the new life it has given you. You feel really good about yourself. Well, almost. \n\
                    For some odd reason, you discover you have an altruistic component to your character, that out of necessity, you have been suppressing for years. \n\
                    But now, since you're in a stable position, you are beginning to listen to it and have decided to follow its promptings. \n\
                    You want to do something meaningful that stands out, even if only in some small way. But this must make a difference in an intellectually \n\
                    satisfying and emotionally gratifying way, as opposed to just keeping the new drug design department of Eli Lilly & Company burning \n\
                    their midnight oil in their 'noble' efforts to keep America healthy.\n\
                    You initially tried to dismiss this desire as a purely ego-driven reaction to your financial success-a type of guilt reaction, \n\
                    if you will-but it just won't go away. This inner need refuses to dry up and let you enjoy your quarterly dividends from those needless, \n\
                    nonsensical invest¬ment norms of bigger, faster, more expensive, more of the same insanities that keep this great land of opportunity on themove.\n\
                    You have been in love with books since you were a kid.\n\
                    But more than this. You are fascinated by the printing pro¬cess and publishing business, having always considered them to be truly noble: \n\
                    one of the highest expressions of humankind's activities. A few months ago, you hear about an investment opportunity in a small publishing house. \n\
                    You investigated it thoroughly. It is old fashioned. Its small mechanical presses, skilled printing professionals, and hardheaded owner \n\
                    still sew the pages before they put a cover on them. Although they only publish one hundred different titles and add a mere ten more a year \n\
                    to their list, their reputation has grown over the past twenty-five years they have been in business, and their books sell as fast as \n\
                    they can print them.\n\
                    The owner would like to move up to the ranks of a medium-sized press, publishing between two hundred to three hundred books a year, \n\
                    and adding as many as twenty new titles to his yearly credit. He realizes he will need new some computer aided equipment to do this, \n\
                    but only so much as is absolutely necessary to make this upward move. He refuses to give in to the computer teckie irrationally driven \n\
                    point-and-click mentality, and has drafted a business plan that not only keeps the press in the old fashioned mechanical type era, \n\
                    but maintains a medium-publisher profile permanently.\n\
                    You like everything about the company but just haven't given it much thought. It's a Wednesday, ruled by Mercury, the planet that governs \n\
                    such matters so power¬fully, and the hour is ruled by Mars. You're aware of this as the telephone rings. Guess who? It's the owner of that \n\
                    small publishing firm. \n\
                    He asks you if you're interested, because he too wants to move on, with or without you. But you and he hit it off very well, and knowing \n\
                    the hour and the Path influence, you agree, and write him your check for one-fifth ownership.\n\
                    The result? You will not only be intellectually and emotionally gratified in the extreme by this decision and action, but will make \n\
                    a handsome profit as well, over time. There won't be any quarterly dividends for awhile, and there will probably be an additional minor sum \n\
                    you will have to contribute due to a sudden or surprise equipment cost increase. But besides the profit, you'll end up learning something about \n\
                    the publishing game, because the owner and you will hit it off so well, he'll start to educate you about all ends of the business. \n\
                    You will also acquire a deep appreciation for craftsmanship, and for the type of people who care about what they do for a living.\n\
                    The interiorization of this experience will rub off on you, adding to your own further success in your own work. Your love for \n\
                    the printed word and its manifestation in book form will skyrocket, bestowing an intellectual and emotional satisfaction that is so deep, \n\
                    it may very well change the way you view yourself and the world around you. All of these things are not simply possible, but well nigh inevitable, \n\
                    when the influence of the 23rd Path is applied to matters ruled by the joined Mars-Mercury plan¬etary pair.",
                    23,
                    12
        ]);
        
        
        influences.push([   
                    8,
                    6,
                    "Positive",
                    "<b>Exemple of Use 1: This time, it's a Wednesday. You look at the your Kabbalistic Cycles chart, and see that the hour you wish to get that Sunday-designed plan of yours off the ground is a Sun Hour. That means flow is down the Tree, the Tarot card is upright, and all is well, but is it really? Consider the card's influences again, in both the upright and reversed positions. Unless you want to strug¬gle for a considerable length of time and have a real fight on your hands, and this, after getting more kicks in the teeth than you can count, don't use this Path of the Devil at all. It has its purpose in magical work, but for daily mun¬dane use, I strongly recommend you stay away from it regardless of its flow. It's just too difficult a Path to work with when it comes to normal, daily matters.</b> \n\
                    <br/><b>Exemple of Use 2:</b> Quite simply, there aren't any for the reasons given above. A void this Path influence and of course, the planetary influences connected by it in this instance. It will bring you nothing but trouble.",
                    26,
                    15
        ]);

        influences.push([   
                    8,
                    7,
                    "Positive",
                    "As with card XV The Devil and its 26th Path, this 27th Path-and the planetary influ¬ences it connects during its rule-are to be strictly avoided. But unlike the 26th Path, the admonition given here is done so in the strongest possible sense. Anything done during either the upward or even downward flow of the Path governed by The Tower, will bring ruin to you, your work, and your plans. Simply reread the Commentary below, and learn from it. I cannot stress this enough! (Although for myself, I do not consider the Path of the Devil to be as severe in daily matters as those of the Tower and the Chariot, I yet place it here for other occult reasons that cannot be addressed in this book. For the reader's safety and peace of mind, then, I have listed the Tarot card of the Devil along with the Chariot and the Tower, for the rea¬sons just given.) Commentary: Card XVI-along with card VII The Chariot and card XV The Devil-and their Paths, are by far the most difficult and dangerous Paths on the Tree. As you will see when working the Cycles System, their influence is to be watched for carefully at all times, and absolutely avoided if at all possible! ",
                    27,
                    16
        ]);
        
        influences.push([   
                8,
                8,
                "Positive/Negative",
                "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                -1,
                -1
        ]);

        
        influences.push([   
                    8,
                    9,
                    "Negative",
                    "<b>Exemple of Use 1:</b> The same as above, but due to one thing or another, you are forced to fill those applications out on a Wednesday, during a Moon Hour. However, flow will be up the Tree, and the 19th Tarot Trump, the Sun, will be in the reversed position, indicating happiness, joy and contentment to a lesser degree, but still, the receipt of your heart's desires. Will you have the same positive experiences as when the flow is down the Tree through this Path during a Mercury Hour and Moon Day? For all intents and purposes-yes! The schools may not fight over recruiting you, but their offers for funding your education and giving you a good stipend will be almost as good as in the previous example. In short, you'll be happy and con¬tent but to a lesser degree. Why is this? Because this 30th Path is the mirror image of the Path of the Tower. That 27th Path which is so hard regardless of the direction of flow, is offset completely by this wondrous, exciting, life¬sustaining and fulfilling connection between Mercury and the Moon. Don't miss out on using it, until your heart's content.\n\
                    <br/><b>Exemple of Use 2:</b> The same demands are made upon you as above, but this time, whether due to others' scheduling or you being pushed, you have to schedule the meeting on a Wednesday during a Moon Hour and of course, flow is upward on the Tree, from the Hour into the Day. As in the above example, your results will be almost as good. There might be a little reserve at first in imple¬menting your ideas, a snag here, a catch there, but imple-mented they will be, and some 'lesser' reward will be given you as a result. Again, you simply cannot go astray when using the influences of this 30th Path.",
                    30,
                    19
        ]);

        //Jupiter Day
        influences.push([   
                    4,
                    3,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);
        
        influences.push([   
                    4,
                    4,
                    "Positive/Negative",
                    "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                    -1,
                    -1
        ]);
        
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
        
        
        influences.push([   
                    4,
                    6,
                    "Negative",
                    "<b>Exemple of Use 1:</b> You have been looking for a chance to get in on the ground floor of a new business, or jump \n\
                    to a new position in your firm, or go off on your own and found your own company. Or maybe you have an opportunity \n\
                    to unload that old building or acre of ground that has been in your family for generations, and is now yours to do with \n\
                    as you please. It's a Thursday, during a Sun Hour. Flow is up the Tree, and Card IX is therefore in the reversed position. \n\
                    What will happen? There is a feeling of cautiousness within you. This is normal for you of course, but somehow this time \n\
                    it seems excessive. You're really on guard. Try as you might, you can't put your finger on it exactly, but somehow, \n\
                    you are very suspicious of the individual and this upcoming meeting. Nevertheless you and he meet. What will the \n\
                    outcome be for you? \n\
                    You will find that the excessive state of caution will completely destroy your best efforts. Your expectations in this \n\
                    matter will come to naught. Not immediately or in a direct manner, but rather slowly, over a lengthy period of time. \n\
                    This is the worst part of the upward movement of flow on this Path. A significant amount of time is lost in 'appearance', \n\
                    causing other opportunities to be lost by virtue of your occupation with the matters at hand that began under the auspices \n\
                    of this influence. Like all upward flow movements along the Paths, this movement should be strictly avoided. \n\
                    <b>Exemple of Use 2:</b> Your've let it be known that you're interest in running for a local office, or for a position \n\
                    in your hobby club, church, or some organization in which you sincerely feel you can do more good than the individual who \n\
                    now occupies that chair. Nothing has come of your declaration over the months, and you've all but forgotten about it. \n\
                    Suddenly, on a Sunday evening, during a Jupiter Hour, you get a telephone call from the chief organizer or head of your group, \n\
                    organization, church or town council.\n\
                    Unknown to you, the right people have decided that you are the right man or woman for the job, and the voice on the other \n\
                    end of the telephone asks you to write a letter to so-and-so tonight, formally stating your qualifications, and outlining \n\
                    your plans for improving the club or organization. You set to work during this hour. The result? As always, the upward flow \n\
                    will damn your best efforts. In this instance, that overly cautions attitude of yours will wind its way into your letter, \n\
                    and in some way, strike a discordant note within the mind of the reader. This note of disbelief will color his mind. \n\
                    As in other reversed examples, you will fail to obtain what you want, but only after a lengthy period of time in which other \n\
                    genuine opportunities presented themselves, and which have been lost due to the delaying aspect of this influence.",
                    20,
                    9
        ]);

        influences.push([   
                    4,
                    7,
                    "Negative",
                    "<b>Exemple of Use 1:</b> It's a Thurday. You've intend to relax by going out for the night. \n\
                     Maybe it will be dinner, some shopping, and a movie. You're feeling 'expansive' -- if a bit fluid -- but generally, pretty good.\n\
                    And you are paging through a self-help book as you're having an impromptu dinner out, trying to have your Friday a day \n\
                    early because of the other commitments tomorrow night. To your delight, a stranger suddenly walks up to you and say, 'Excuse me! I couldn't help notice \n\
                    that book you're reading! I've been doing my best to understand it, but I'm hung up on a few points, and don't know anyone else \n\
                    who's reading it. Do you mind if I ask you a question or two?' \n\
                    But you notice that it's a Venus Hour, and flow is up the Tree. Card X The Wheel of Fortune is reversed. Does this mean that the oh! \n\
                    so tempting situation is doomed ot abject failure, and will fall apart before you've had a chance to fantasize undtil your heart's content ?\n\
                    Surprise! In this case, not exactly so! What do I mean?  It is strange, but this card is so powerful, that even in its reversed position \n\
                    -- that is, in a flow up the Tree from a Venus Hour into a Jupiter Day -- the card produces indirect beneficent results. How can this \n\
                    happen in this idealized example?\n\
                    The beautiful woman or handsome man will either be with a friend, or will introduce you to his or spitting image, or will suggest the \n\
                    two of you go shopping together, take in that movie, or any of a host of possibilities in which you will end up having the same \n\
                    experience you did in the downward flow. In any event, it will be through his or her influence that you will be encouraged to either \n\
                    go somewhere you would not normally go yourself, or change the established sequence of doing things you had originally planned to do \n\
                    that night, or some such variation on the theme. And it will be through such changes that the good of this card will come to you \n\
                    even through the flow is upward. In short, the benefits of the card will flow to you -- albeit indirectly -- as though the flow were \n\
                    downward on the Tree and the card were in the upright position. That is, from the Hour into the Day. \n\
                    Why is this the case here? I put it down to a 'Tension of Creation' as I term it, in which the Great Benefic Jupiter interects with a very \n\
                    earthy, mundane Venus, in order to bring about a new creation, regardless of the direction of flow. Yet, as you saw, the upward \n\
                    flow does have a skewing effect, in that it complicates and blinds the initial force flowing from Jupiter. Still, the combination of these \n\
                    two planets ever pushing toward physical pleasure, completion, and beneficence in the material world, overcomes the normally deleterious \n\
                    effect of the upward flow, although in an indirect and sometimes very confusing manner. \n\
                    The admonition to the reader in such a case of reversed flow, is to be exceptionally alert to the events issuing from the initial condition \n\
                    that arises under this reversed card influence.\n\
                    \n\
                    <br/><b>Exemple of Use 2:</b> You want to beautify your home. Too long have you lived in a dingy, shabby square or retangle, the ceiling \n\
                    of which you rarely look at, and whose floors you try your best to ignore. The dirty, worn out carpeting has really been bothering \n\
                    you for years. With age, you've come to understand that your surroundings have a definite, powerful bearing upon your mood and emotions. \n\
                    And in turn, thesse emotions have a direct effect upon you feelings about yourself, your life, and -- come to think of it -- \n\
                    how you feel about others, even after you leave that closed geometry you call home. \n\
                    You decide to do all the shopping on Thursday, during a Venus Hour. The flow is against you. Nevertheless, you will experience the same good \n\
                    results as when the flow is downward, but in an indirect way. It may be that you have to visit more stores, can't quite find what you're looking \n\
                    for, have to make changes in the original designs you had your heart set on, or any of the infinite possibilites that underlie any \n\
                    experience. But still, as hard as it may be for you to believe right now, you will wind up with the very same beneficial results. \n\
                    Results that will produce the exact same effects in you as those that were generated by the easy experience when the flow wad down the Path. \n\
                    It's just the way it works.",
                    21,
                    10
        ]);

        influences.push([   
                    4,
                    8,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);

        influences.push([   
                    4,
                    9,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);


        //Venus Day
        influences.push([   
                    7,
                    3,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);        
        
        influences.push([   
                    7,
                    4,
                    "Positive",
                    "<b>Exemple of Use 1:</b> It's a Friday. You've put in a hard week, and intend to relax by going out for the night. \n\
                     Maybe it will be dinner, some shopping, and a movie. You're in a very positive frame of mind, and enjoy being around people, \n\
                    perhaps more on this day, than on any other. You're enjoying your dinner, paging through a self-help book you've been trying \n\
                    to get through for the last month, when a stranger suddenly walks up to you and say, 'Excuse me! I couldn't help notice \n\
                    that book you're reading! I've been doing my best to understand it, but I'm hung up on a few points, and don't know anyone else \n\
                    who's reading it. Do you mind if I ask you a question or two?' \n\
                    Surprised, you look at the very attractive woman or man standing at your side. The smile is infectious, and you are beginning to \n\
                    feel something in the pit of your stomach that you haven't felt since your high school days -- butterflies! \n\
                    'Why, I'd be delighted to help if I can! Won't you join me? It would make matters a lot simpler for both of us!' \n\
                    The adorable woman (or handsome man) smiles broadly, and almost too eagerly replies, 'Thank you, I'd love to!'.\n\
                    As he or she slides onto the seat across from you, you happen to glance at that small Kabbalistic Cycles chart you've \n\
                    been using as a makeshift book mark, and find that it's Jupiter Hour! That's right! Card X the Wheel of Fortune is at work \n\
                    with all of the joy, excitement, and fulfillment that it brings, and of course, it's in the upright position. What are the \n\
                    details of this happy situation, how do they unfold, and where do they lead? \n\
                    I'll let the reader fill the blanks from this point on. But I will say that such a situation will turn out splendidly for both \n\
                    of you, in all areas of life, even so far as eventually making the situation permanent. An idealized example? \n\
                    Something you only find in the movies or in a book? Don't count on it! Not when it comes to the downward flow of a Jupiter \n\
                    Hour into a Venus Day! The most amazing, charming, happy and exciting events are realized under this influence. On this you can count!\n\
                    \n\
                    <b>Exemple of Use 2:</b> You want to beautify your home. Too long have you lived in a dingy, shabby square or retangle, the ceiling \n\
                    of which you rarely look at, and whose floors you try your best to ignore. The dirty, worn out carpeting has really been bothering \n\
                    you for years. With age, you've come to understand that your surroundings have a definite, powerful bearing upon your mood and emotions. \n\
                    And in turn, thesse emotions have a direct effect upon you feelings about yourself, your life, and -- come to think of it -- \n\
                    how you feel about others, even after you leave that closed geometry you call home. \n\
                    So now you are going to do something about it, and not in some cheap, slipshod way, either! You've been saving for awhile, getting ideas, \n\
                    and really making a concerted effort to change your world from the outside in, instead of only the inside out, as has been your \n\
                    philosophy until now. This time you pull out your trusty, Jim-dandy Kabbalistic Cycles chart and consciously decide on the time to go \n\
                    shopping and spend all that hard earned money to make your dwelling a place you can truly live in. \n\
                    And guess what time you select? Of course! A Friday, during a Jupiter Hour, when the flow is down the Tree, an the Wheel of Fortune \n\
                    Tarot Trump is in the upright position! Just the influence needed to make you feel luxurious, and to attract those fineries that extend \n\
                    this luxury to your home by selecting just the right items for your new décor. The shopping spree begins as planned, and last throughout \n\
                    the day. Of course, you are aware by now that the important influence is the one under which an activity begins, since that influence is \n\
                    carried through to successive hours as long as the intent is there.\n\
                    While you're hard at work selecting this and paying for that, an art print catches your eye. You thought of buying a few inexpensive \n\
                    pictures to brighten up those dark, empty spaces on your walls, but you had no idea you would find such a beautiful, delightful  print \n\
                    that simply brings out the very best in your emotional nature. It is breathtaking and -- you can afford it! You happily add it to your \n\
                    swelling collection, and after a hard ten or so hours shopping, you head home and spend the next two days putting your new treasures in place. \n\
                    As the weeks pass, you notice not simply an improvement in your overall attitude toward yourself and others, but a calmness and peace of mind \n\
                    that refreshes you from the outside in, and the inside out. You sleep more soundly, have more energy, and are much more positive and optimistic. \n\
                    As if this wasn't enough, you notice you are more creative, think more clearly, and appreciate Life in all of its manifestations more than \n\
                    you ever have before. Is all this possible? Can all of these benefits truly sping from doing something as simple as redecorating, and doing \n\
                    it under the auspices of this planatery combination / Path influence? You better believe it is!\n\
                    The long and the short of it is this. You can either work with the forces of the Tree and Nature, or work against them, according to that famous \n\
                    of all rationalization: 'I'll do what I want when I want. I have absolute Free Will!'. Either way you will get results. The question is, what kind? \n\
                    The answer to that you will know and be more than happy with if you follow the Kabbalistic Cycles System being taught here. ",
                    21,
                    10
        ]);

        influences.push([   
                    7,
                    5,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);

        influences.push([   
                    7,
                    6,
                    "Positive",
                    "<b>Exemple of Use 1:</b> It's a Friday, and the Sun is ruling the hour when you arrive home. Flow is down the Tree and positive. Likewise, the Tarot Trump XIII is in the up¬right position. As you approach the front door, you wish that when you walked inside, your wife, husband, or sig¬nificant other would be happy to see you, throw his or her arms around you, tell you how excited they are to have you all to themselves during the upcoming weekend, and then lay out a set of plans for the two of you that would have you jumping up in the air and clicking your heels. But you know better. The life you have been sharing for these past few years has been anything but happy. Where is the Sun's influence of Life, Light, and growth together, as a couple? Where is that Venus influence of unselfish¬ness, physical lovemaking, and luxury, the two of you shared throughout the first several years of your marriage or relationship? What has happened to all of those good times? As you walk through the door, you see the answer to all of these questions in the form of packed luggage piled neatly in the center of the living room. Before you can take stock of the situation, your partner emerges from the adjoining room, and says, 'It's best this way for both of us. I've had enough, and I think you have too! I'm leaving. My attorney will contact you on Monday, and we can start divorce proceedings,' or similar words depending upon the exact type of relationship the two of you had. Yes, the Sun's influence-so life-giving-and the force of Venus-so nurturing and pleasure seeking-have been scattered by the harsh realities of the 24th Path. You make a fainthearted attempt to stop him or her from leaving, but your former partner just throws a sideways glance at you as if to say, 'Please don't keep this charade up. It's over, and we both know it!' And so you step aside as the taxi pulls up to the front door, the driver puts the luggage into the cab, and you watch the most important part of your life disappear down the driveway, and out of sight. Between the tears, there is a deep, inner sense of relief, but something you just can't handle at the moment. So your let the immediacy of the situation's impact overtake you, and spend the weekend in your own type of hell. You are alone, unable or unwilling to speak to anyone about the shattered thing you now call your life. The months drag on, and your lawyers have been lining their pockets with you and your former partner's hard earned money, and you are still numb inside. A few more months pass, and something has hap¬pened. You've accepted the situation, and as your former partner's glance had conveyed to you, you now realize ending the relationship was the best thing for both of you. You start to live again, although the idea of dating just doesn't quite appeal to you yet. That is, not until that fateful Friday, during a Jupiter Hour with its downward flow, when the 21st Path's influence has you sitting in that restaurant with that self-help book, and that beautiful woman or handsome man approaches you with a few questions about that same book she or he is reading! See how it works? The Path of Death is indeed a hard one, and I am not trying to lighten it by painting some cheap, ego-bolstering rosy picture, painted with the sooth¬ing colors of lies. No, believe it or not, this is how the initial and final effects of this Path work out in the end. Something very good happens as a consequence of the 'death' of some situation or condition. And that something is always a new, life-enhancing experience that brings about magnificent personal growth for the individual. From your own hell to your own purgatory, and finally into your own heaven on earth, is the experience and reward of this Path. Don't fear it. Struggle with it, try to avoid it if you can and if you so choose. But equally, accept it when it strikes unexpectedly, and seems to kill your soul. Accept it because a new day will dawn, and it will once again be filled with the glories of the Sun and the joys of Venus, issuing forth in some unseen, hidden way.\n\
                    <b>Exemple of Use 2:</b> It's a Friday, and knowing the planetary influence is favorable for succeeding in almost any activity, you decide to open the doors of your new busi¬ness. After all, it's the start of a busy, buying weekend, and you have your new store located in the very heart of the busiest section of the mall! What better time to start such an enterprise! Sure, you decided you're going to open during a Sun Hour. Flow will be down the Tree, the Tarot card will be in the upright position, and the 24th Path of Death will be invoked. Who cares? You have Free Will, remember? All that nonsense of Kabbalistic Cycles you unfortu¬nately read and became so angry over, doesn't mean a damn thing, and you know it! Just some jerk's stupid idea. 'Hell, I don't need any idiot telling me my marketing research and plans are dependent upon some ridiculous planet or Path scheme or whatever it was about anyway! I decide what I do, and take full responsibility for it!' Well, bully for you! because that's just what you must do when the business axe falls, and your new store-right in the center of the busiest section of the mall-fails big time! Oh, you'll scramble, change stock, sales people, give away door prizes and cut your prices to the bone-right before you close the doors and worry about facing the bank loan officer next week to tell him you can't make that business loan payment. Time will pass, and after much agony and soul searching, you'll eventually see something you completely missed before, or be offered to get in on a new venture, and-maybe even using this stupid Kabbalis¬tic Cycles System-will go in for it during a fortunate time. Surprisingly, the money for it will come out of nowhere, the new business will flourish, and after licking your wounds, you'll start making that profit you always dreamed of. Count on the essence of this experience happening, because it will.",
                    24,
                    13
        ]);
        
        influences.push([   
                    7,
                    7,
                    "Positive/Negative",
                    "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                    -1,
                    -1
        ]);

        
        influences.push([   
                    7,
                    8,
                    "Negative",
                    "As with card XV The Devil and its 26th Path, this 27th Path-and the planetary influ¬ences it connects during its rule-are to be strictly avoided. But unlike the 26th Path, the admonition given here is done so in the strongest possible sense. Anything done during either the upward or even downward flow of the Path governed by The Tower, will bring ruin to you, your work, and your plans. Simply reread the Commentary below, and learn from it. I cannot stress this enough! (Although for myself, I do not consider the Path of the Devil to be as severe in daily matters as those of the Tower and the Chariot, I yet place it here for other occult reasons that cannot be addressed in this book. For the reader's safety and peace of mind, then, I have listed the Tarot card of the Devil along with the Chariot and the Tower, for the rea¬sons just given.) Commentary: Card XVI-along with card VII The Chariot and card XV The Devil-and their Paths, are by far the most difficult and dangerous Paths on the Tree. As you will see when working the Cycles System, their influence is to be watched for carefully at all times, and absolutely avoided if at all possible! ",
                    27,
                    16
        ]);
        
        influences.push([   
                    7,
                    9,
                    "Negative",
                    "<b>Exemple of Use 1:</b> Now, if that same aspiring busi¬nessman would have opened that business of his on a Friday during a Moon Hour, in which flow is upward on the Tree, to say that his happy expectations and joyful ex¬pectancies will soon be disappointed, would be to make an understatement. No matter how hard he tries, regardless of stocking his new store with the exact same merchandise as he did above, and which appeals to women, or contains a line of art and literary books, or items of pure luxury and extravagance, his venture will fail abysmally. The upward flow of this Path is very severe in its pronouncements. Additionally, one should use extreme care when deciding to simply be out and about for social reasons during this influence. It is extremely negative for indulging in any social matters whatsoever.\n\
                    <br/><b>Exemple of Use 2:</b> It's a Friday, the hour of which is ruled by the Moon. Nevertheless, you can't really believe all the cycles stuff, and you ask her the big question. Sur¬prise! She accepts! See? All of that running the important affairs of your life by some insane idea some author cooked up to rationalize away his own life is just that: a bunch of nonsense, and you just proved it. The scene fades, and somewhere between the end of your first year to the middle of your third year of marriage, you're looking for a good divorce lawyer to protect you as much as possible, while trying to figure out how you will pay the child support and 'temporary' alimony, and keep body and soul together. Is this really possible? Are there such forces out there that can-that did!-effect your life so drastically simply because you ignored the times of their influence? Guess it's time to fall back on your Free Will rationalization, and think it through for yourself. After all, you'll have plenty of time, sitting alone in that one-room efficiency apartment. You certainly won't have any money to be out and about now, not with all that child support and 'temporary' alimony to pay.",
                    28,
                    17
        ]);
        
        
        //Saturne Day
        influences.push([   
                    3,
                    3,
                    "Positive/Negative",
                    "How do you use the combined influence that arises when the same planet is ruling both the day and the hour you are interested in? Say, on a Thursday ruled by Jupiter, during an hour ruled by Jupiter? Or a Friday, during a Venus Hour? That's easy. Don't! As it turns out, this double effect is very deleterious to all issues governed by the ruling planet. It is curious in the extreme, but instead of this combined influ-ence strengthening the force exerted on the matter by the planet, it actually provides a destabilizing effect. Does this instability hold throughout the entire hourly period in question? No. It oscillates between a very positive and very negative effect, but at different times during that hour. Since you will never know when the positive or negative effect is dominant unless you test it out, you are better off waiting for another hour. If you enjoy intelligent experimenting as I do however, go ahead and use this powerful, unstable influence. I assure you, you will learn much!",
                    -1,
                    -1
        ]);
        
        influences.push([   
                    3,
                    4,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);
        
        
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
                    "<b>Exemple of Use 1:</b> You are looking to make a real estate investment. Someone approaches you out of the blue, on -- curiously enough -- a Saterday, during a Sun Hour with what sounds like a ideal offer. The flow is up the Tree, and hence the Tarot Card, the Lovers, is reversed. Should you now enter into this deal? Run from this offer as fast as you can because some new variable will be operating in the background that will bring total and complete failure to the venture, and total loss of your investment. \n\
                    <br/><b>Exemple of Use 2:</b> You make plans for personal growth and go to work on them during a Saturday during an hour ruled by the Sun. See the problem? Of course you do. There is an upward flow from the planet ruling the hour, into the planet ruling the day. Result: about as good as when you evolved your ideas during the Mercury Hour of this day, which was another upward flow. They will fail, for one reaon or another.",
                    17,
                    6
        ]);
        
        influences.push([   
                    3,
                    7,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);

        influences.push([   
                    3,
                    8,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
        ]);
        
        influences.push([   
                    3,
                    9,
                    "-",
                    "Where there are no Paths connecting the Planet ruling the Day with a Planet ruling any given Hour, there is a very easy rule you will learn later on, that works every time. Here it is. On any given day, when the hour you are interested in is not connected to the ruler of that day by a Path, simply use the influence of the hour in question. For example. It's a Thursday, ruled by Jupiter. The hour however is ruled by Mercury, and a business, academic, or mystical issue arises. Should you wait for another time to act on or evaluate the issue? Of course not! Simply use the influ¬ence of the hour in question, since the hour's influence moderates the effect of the planet ruling the day by a factor of four.",
                    -1,
                    -1
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
    
    DBService.prototype.getInfluence = function (daySephirah, hourSephirah, callback){                
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
    
    DBService.prototype.getTarot = function (path, callback){                

        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT * FROM tarots WHERE path=?";

            transaction.executeSql (sql, [path],
            function(transaction, result){
                if (result.rows.length){
                    var tarot = result.rows.item(0);
                    callback(tarot);
                }
            }, error);
        });
        return;
    };
    
    DBService.prototype.getPath = function (pathNumber, callback){                

        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT * FROM path WHERE number=?";

            transaction.executeSql (sql, [pathNumber],
            function(transaction, result){
                if (result.rows.length){
                    var path = result.rows.item(0);
                    callback(path);
                }
            }, error);
        });
        return;
    };
    
    DBService.prototype.getSephirah = function (sephirahNumber, callback){                

        this.db.transaction (function (transaction) 
        {
            var sql = "SELECT * FROM sephirah WHERE number=?";

            transaction.executeSql (sql, [sephirahNumber],
            function(transaction, result){
                if (result.rows.length){
                    var sephirah = result.rows.item(0);
                    callback(sephirah);
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
