package the.edgy.ui.profile;

import android.content.res.Resources;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.util.Base64;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.annotation.NonNull;
import androidx.fragment.app.Fragment;

import java.io.ByteArrayOutputStream;

import the.edgy.R;

public class ProfileFragment extends Fragment {

    private Button buyMembership;

    // Buy Membership button listener which opens up a new fragment where the purchase can be made.
    private Button.OnClickListener buttonListener = new
            Button.OnClickListener() {
                @Override
                public void onClick(View v) {
                    Fragment buyMembershipFragment = new BuyMembershipFragment();

                    // Replaces current fragment with a new fragment.
                    /*
                     *  @Note: the new fragment is a 'sub_fragment' of its parent,
                     *         and hence will have a tag of the form:
                     *
                     *         '<parent>_sub_fragment'
                     */
                    getActivity().getSupportFragmentManager().beginTransaction().
                            replace(R.id.fragment_container, buyMembershipFragment, "profile_sub_fragment").
                            addToBackStack("profile_sub_fragment").
                            commit();
                }
            };

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater, @Nullable ViewGroup container, @Nullable Bundle savedInstanceState) {

        View root = inflater.inflate(R.layout.fragment_profile, container, false);

        // Create a button.
        buyMembership = (Button) root.findViewById(R.id.buy_membership);

        buyMembership.setOnClickListener(buttonListener);


        // TODO: Import base64 qr code.
        String base64QR = "iVBORw0KGgoAAAANSUhEUgAAAHQAAAB0CAYAAABUmhYnAAAAAklEQVR4AewaftIAAAKvSURBVO3BQW7sWAwEwUxC979yjZdcPUCQuv3NYYT5wRqjWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoFw+pfFMSOpWTJHQqXRJOVL4pCU8Ua5RijVKsUS5eloQ3qbwpCZ1Kl4STJLxJ5U3FGqVYoxRrlIsPU7kjCW9SOUnCEyp3JOGTijVKsUYp1igXf1wSTlS6JHQqXRL+smKNUqxRijXKxR+n0iWhS0KnMlmxRinWKMUa5eLDkvBJSehUTpLwpiT8S4o1SrFGKdYoFy9T+SaVLgmdyolKl4QTlX9ZsUYp1ijFGsX8YBCVLgn/J8UapVijFGuUi4dUuiScqHyTykkSOpUuCScqXRI6lTuS8ESxRinWKMUa5eLDVLoknKh0SehUuiR0Kneo3KFyotIl4UTlTcUapVijFGuUi4eS8IRKl4ROpUtCp3KShE7lJAl3JKFT+U3FGqVYoxRrFPODL1LpkvAmlZMkdCpvSsJvKtYoxRqlWKNcvEylS8KJyh1JeELlk1ROktCpdEl4olijFGuUYo1ifvCHqdyRhE7ljiTcoXJHEp4o1ijFGqVYo1w8pPJNSbgjCZ1Kl4Q3qZwk4ZOKNUqxRinWKBcvS8KbVO5IQqfSJeEOlS4JJ0noVE5UuiQ8UaxRijVKsUa5+DCVO5LwhMoTKneodEn4TcUapVijFGuUi2GScIfKHSp3JOEkCW8q1ijFGqVYo1z8cUnoVLokdCp3JKFTOVHpktCpnCThiWKNUqxRijXKxYcl4ZuS0KnckYQ7ktCpnCShU3lTsUYp1ijFGuXiZSrfpHKShBOVTqVLwolKl4RO5SQJbyrWKMUapVijmB+sMYo1SrFGKdYoxRqlWKMUa5RijVKsUYo1SrFGKdYoxRqlWKMUa5RijfIfzd37+o8YnKQAAAAASUVORK5CYII=";

        byte[] qrByteArray = Base64.decode(base64QR, Base64.DEFAULT);
        Bitmap bitmap = BitmapFactory.decodeByteArray(qrByteArray, 0, qrByteArray.length);

        ImageView qrCode = (ImageView) root.findViewById(R.id.qr_membership);
        TextView noMembershipText = (TextView) root.findViewById(R.id.no_membership_text);

        noMembershipText.setText("Current membership:");

        qrCode.setVisibility(View.VISIBLE);
        qrCode.setImageBitmap(bitmap);


        return root;
    }


    @Override
    public void onPause() {
        super.onPause();
    }

}