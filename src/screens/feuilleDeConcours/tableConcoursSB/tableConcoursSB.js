import React, {useState} from 'react';
import {View} from 'react-native';
import {colors} from '_config';
import {MyInput} from '_components';
import {getHauteurToTextValue} from '../../../utils/convertor';

export const getHeaderTableSB = bars => {
  var result = [];
  if (bars.length > 0) {
    bars.forEach(bar => {
      result.push({
        type: 'text',
        width: 75,
        text: getHauteurToTextValue(bar?.toString()),
      });
    });
  }
  return result;
};

export const getColumnsVisibleSB = (bars, columnPerfVisible) => {
  return columnPerfVisible ? bars?.map((bar, index) => index) : [];
};

export const calculBestPlaceSB = (resultats, nbTries) => {
  return null;
};

const TableConcoursSB = props => {
  const calculBestPerf = resultat => {
    var res = null;
    const count = props.bars.length;
    for (var i = 0; i < count; i++) {
      if (
        resultat.LstEssais[i].ValeurPerformance !== null &&
        resultat.LstEssais[i].ValeurPerformance !== ''
      ) {
        if (resultat.LstEssais[i].ValeurPerformance?.toString().includes('O'))
          res = props.bars[i];
      }
    }
    if (
      resultat.LstEssais.every(
        v =>
          v.ValeurPerformance === '' ||
          v.ValeurPerformance === null ||
          v.ValeurPerformance === '-',
      )
    ) {
      res = 'DNS';
    }
    return getHauteurToTextValue(res?.replace('m', ''));
  };

  const verifyVisibility = (item, index) => {
    //Si l'element a un index entre premier index des colonnes visibles et premier index+nb de colonnes visibles
    return props.listColumnVisible.indexOf(index) >=
      props.indexFirstColumnVisible &&
      props.listColumnVisible.indexOf(index) <
        props.indexFirstColumnVisible + props.numberOfColumnVisible &&
      props.listColumnVisible.includes(index)
      ? item
      : null;
  };

  const saveEssai = async (resultat, numEssai, index) => {
    const result = resultat.LstEssais[numEssai].ValeurPerformance?.replace(
      'm',
      '',
    );
    var newResultat = props.concoursData;
    var essaiComplete = true;
    const meilleurPerf = calculBestPerf(resultat);
    props.setBestPerf(meilleurPerf);
    resultat.Performance = meilleurPerf;
    if (result != '' && result !== null) {
      newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats[
        index
      ] = resultat;
      await setFile(props.concoursData?._?.id, JSON.stringify(newResultat));
      newResultat.EpreuveConcoursComplet.TourConcoursComplet.LstSerieConcoursComplet[0].LstResultats.map(
        (v, i) => {
          if (
            v.LstEssais[numEssai].ValeurPerformance === null ||
            v.LstEssais[numEssai].ValeurPerformance === ''
          ) {
            essaiComplete = false;
          }
        },
      );

      if (essaiComplete) {
        props.setEssaiEnCours(numEssai + 1);
      }
      props.setAthleteEnCours(
        getNextAthlete(numEssai + (essaiComplete ? 1 : 0)),
      );
      props.setHaveToCalculPlace(oldValue => !oldValue);
      //Mise à jour du statut du concours
      if (props.concoursData._?.statut === i18n.t('common:ready')) {
        var data = props.concoursData;
        data = setConcoursStatus(data, i18n.t('common:in_progress'));
        await setFile(data?._?.id, JSON.stringify(data));
        props.refreshConcoursData();
      }
    }
  };

  const onChangeTextValue = (resultat, numEssai, value) => {
    var isValid = false;
    const validValues = ['o', 'O', 'x', 'X', '-', 'r', 'R', '', null];
    if (validValues.includes(value)) {
      isValid = true;
      if (value === 'x' || value === 'R' || value === 'o') {
        value =
          value === 'x' || value === 'o'
            ? value.toUpperCase()
            : value.toLowerCase();
      }
      resultat.LstEssais[numEssai].ValeurPerformance = value;
      resultat.LstEssais[numEssai].SatutPerformance = value;
    }
    return isValid;
  };

  const lstTextInput = [];
  const initValue = [];
  const count = props.bars.length;
  for (var i = 0; i < count; i++) {
    initValue.push(props.resultat.LstEssais[i].ValeurPerformance);
  }
  const [values, setValues] = useState(initValue);
  for (var i = 0; i < count; i++) {
    const indexH = i;
    lstTextInput.push(
      <View style={[/*styleSheet.flex1*/ {width: 70, marginEnd: 5}]}>
        <MyInput
          textAlign={'center'}
          style={[
            {
              backgroundColor:
                (props.resultat.LstEssais[indexH].ValeurPerformance === null ||
                  props.resultat.LstEssais[indexH].ValeurPerformance === '') &&
                indexH === props.essaiEnCours
                  ? colors.white
                  : colors.gray_light,
              width: 70,
            },
          ]}
          onChange={v => {
            const isValid = onChangeTextValue(props.resultat, indexH, v);
            if (isValid) {
              setValues(oldValues =>
                oldValues.map((val, ind) => (ind === indexH ? v : val)),
              );
            }
          }}
          value={values[indexH]}
          onBlur={() => {
            saveEssai(props.resultat, indexH, props.index);
            setValues(oldValues =>
              oldValues.map((val, ind) =>
                ind === indexH && val !== null
                  ? getHauteurToTextValue(val.replace('m', ''))
                  : val,
              ),
            );
          }}
        />
      </View>,
    );
  }
  return (
    <>
      {props.bars?.map((bar, index) => {
        return (
          <>
            {verifyVisibility(
              props.resultat.Athlete?.firstBar === undefined ||
                bar >= props.resultat.Athlete?.firstBar ? (
                lstTextInput[index]
              ) : (
                <View style={{width: 75}}></View>
              ),
              index,
            )}
          </>
        );
      })}
    </>
  );
};

export default TableConcoursSB;
