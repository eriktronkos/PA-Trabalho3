package utils;

import java.text.Normalizer;

public class Utils {
//------------------------------------------------------------------------------    
    public static String removerBrancosExtras(String input) {
        if (input == null || input.equals("")) return input;
        input = input.trim();
        input = input.replaceAll("\\s+", " ");
        return input;
    }
//------------------------------------------------------------------------------    
    public static String removerDiacriticosNormalizar(String input) {
        if (input == null || input.equals("")) return input;
        final String decomposed = Normalizer.normalize(input, Normalizer.Form.NFD);
        String saida = decomposed.replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        saida = saida.toUpperCase();
        saida = saida.replace("'"," ");
        saida = saida.replace("´"," ");
        saida = saida.replace("-"," ");
        saida = saida.replace(":"," ");
        saida = saida.replace("/"," ");
        saida = saida.replace("."," ");
        saida = saida.replace(";"," ");
        saida = saida.replace(","," ");
        saida = saida.replace("("," ");
        saida = saida.replace(")"," ");
        saida = Utils.removerBrancosExtras(saida);
        return saida;
    }
//------------------------------------------------------------------------------    
}
