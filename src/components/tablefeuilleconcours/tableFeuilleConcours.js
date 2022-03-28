import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, FlatList, TextInput} from 'react-native';
import {useTranslation} from 'react-i18next';
import {colors} from '_config';

const TableFeuilleConcours = props => {
  const [t] = useTranslation();
  const [hasDossard, setHasDossard] = useState(false);

  const serie =
    props.compData.EpreuveConcoursComplet.TourConcoursComplet
      .LstSerieConcoursComplet[0];
  const NbSec_plusde3athletes = serie.NbSec_plusde3athletes?.toString();
  const NbSec_2ou3athletes = serie.NbSec_2ou3athletes?.toString();
  const NbSec_1athlete = serie.NbSec_1athlete?.toString();
  const NbSec_EssaiConsecutif = serie.NbSec_EssaiConsecutif?.toString();

  const setVariable = () => {
    var res = false;
    props.tableData.forEach(row => {
      if (row.Athlete.Dossard) res = true;
    });
    setHasDossard(res);
  };
  useEffect(() => {
    setVariable();
  }, []);

  const createEssai = (resultat, numEssai, value) => {
    var essai = {
      GuidCompetition: props.compData.GuidCompetition,
      GuidResultat: resultat.GuidResultat,
      GuidEssai: '', //créer un guid
      NumEssai: numEssai,
      ValeurPerformance: value,
      SatutPerformance: 'O', //(X, O, -, r (retiré compétition))
      //GUID_BARRE (nullable)
      //Vent (10, -10), règle saisie (nullable)
    };
    if (resultat['LstEssais'] == null) resultat['LstEssais'] = [];
    resultat['LstEssais'][numEssai - 1] = essai;
  };

  const Item = ({id, order, dossard, athlete, resultat}) => (
    <>
      <View style={styles.item}>
        <View style={{flex: 1}}>
          <Text style={styles.text}>{order}</Text>
        </View>
        {hasDossard && (
          <View style={{flex: 1}}>
            <Text style={styles.text}>{dossard}</Text>
          </View>
        )}
        <View style={{flex: 4}}>
          <Text
            style={{color: colors.black, fontSize: 16, fontWeight: 'bold'}}
            numberOfLines={1}>
            {athlete.split('\n')[0]}
          </Text>
          <Text style={{color: colors.black, fontSize: 16}} numberOfLines={1}>
            {athlete.split('\n')[1]}
          </Text>
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={value => {
              createEssai(resultat, 1, value);
            }}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 1}}>
          <TextInput
            style={styles.textinput}
            onChangeText={() => {}}
            value={''}
            keyboardType="numeric"
          />
        </View>
        <View style={{flex: 2}}>
          <Text style={styles.text}></Text>
        </View>
        <View style={{flex: 1}}>
          <Text style={styles.text}></Text>
        </View>
      </View>
    </>
  );

  const renderItem = ({item, index}) => (
    <Item
      id={item.id}
      order={item.NumCouloir}
      dossard={item.Athlete.Dossard?.toString()}
      athlete={
        item.Athlete.Prenom +
        ' ' +
        item.Athlete.Nom +
        '\n' +
        item.Athlete.Club +
        ' - ' +
        item.Athlete.Categorie
      }
      resultat={item}
    />
  );

  return (
    <View style={[styles.containerCenter]}>
      <View style={{flex: 1}}>
        <View style={styles.headerTable}>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:order')}</Text>
          </View>
          {hasDossard && (
            <View style={{flex: 1}}>
              <Text style={styles.text}>{t('competition:number')}</Text>
            </View>
          )}
          <View style={{flex: 4}}>
            <Text style={styles.text}>{t('competition:athlete')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:first')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:second')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:third')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>
              {t('competition:performance').substring(0, 4) + '.'}
            </Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:fourth')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:fifth')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:six')}</Text>
          </View>
          <View style={{flex: 2}}>
            <Text style={styles.text}>{t('competition:performance')}</Text>
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.text}>{t('competition:place')}</Text>
          </View>
        </View>
        <View style={{flex: 1}}>
          <FlatList
            contentContainerStyle={{
              flexGrow: 1,
            }}
            data={props.tableData}
            renderItem={renderItem}
            keyExtractor={(item, index) => {
              return index;
            }}
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  containerCenter: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    marginHorizontal: 20,
    flex: 1,
  },
  titleText: {
    fontSize: 20,
    color: colors.ffa_blue_light,
    margin: 15,
    textAlign: 'center',
    paddingVertical: 10,
  },
  text: {
    color: colors.ffa_blue_light,
    fontSize: 14,
    paddingHorizontal: 10,
  },
  item: {
    flexDirection: 'row',
    backgroundColor: colors.gray_light,
    margin: 1,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  headerTable: {
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingBottom: 5,
  },
  text: {
    color: colors.black,
    fontSize: 16,
  },
  textinput: {
    height: 35,
    marginRight: 5,
    color: colors.black,
    borderColor: colors.muted,
    borderWidth: 1,
  },
});

export default TableFeuilleConcours;