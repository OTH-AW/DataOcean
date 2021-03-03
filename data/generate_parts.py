# helper script for generate dummy parts
import random
names = ["Tranformator","Spule","Sortierer","Akku","Wasseranschluss","Netzbetrieb","Fließband","Motor","Greifarm","Säge","Laser","Lupe","Wasserschneider","Pneumatische Steuerung","Benutzerkonsole","Display","USB-Anschluss","interner Speicher","Timer","Magnet","Not-Ausschalter","Drucker","Lautsprecher","erweiterbar","Lichtsschranke","Wasserwaage","Waage","Produktzähler","Zahnrad","Displayport","Touchscreen","Lärmdämmung","Uhr","Niedrigdruckresistent","Hochdruckresistent","Ventilator","Genertor","Warnsystem","Arbeitsfläche","Schadstofffilter","Fußschalter","Schaltschrank","Kugelumlaufspindel","Drehmechanismus","Festplatte","Beleuchtung","Powerknopf","Kabel","Trommel","Vergaser","Blasgerät","Mainboard","Grafikkarte","Kontrollleuchten","Dynamo","Kreiselpumpen","Kreiselverdichter","Träger","Diagnosemodul","Bewegunssensor","Drucksensor","Lichtsensor","Feuermelder","Fingerablage","Kippablage","Schutzkontaktsteckdose","Überladeschutz","Erdung","Luftregulierventil","Edelstahlinnenbehälter","Siebträger","Entkalker","Duschsieb","Wärmetauscher"]

f = open("data/parts.csv", 'w')
head = "created,name,quality"
print (head)
f.write(head + "\n") 
# All months with 31 days, every 2th.
month_31 = [lm for lm in range (1,7+1,2)] + [lm for lm in range(8,12+1,2)]
for mon in range(1,12+1):
    ending_day = 28 if mon == 2 else 31 if mon in month_31 else 30
    for day in range (1, ending_day + 1):
        for hour in range (8, 9 ):
            date = "2020-%02d-%02d %2d:00:00" % (mon ,day, hour)
            line = "%s, %s, %i" %(date, random.choice(names), random.randrange(30,100))
            #print (line)
            f.write(line + "\n") 
f.close()